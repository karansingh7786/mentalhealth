from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()  # Load variables from .env file

app = Flask(__name__)
CORS(app)

# --- CONFIGURATION ---
DB_HOST = os.environ.get("DB_HOST", "localhost")
DB_USER = os.environ.get("DB_USER", "root")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "Satrujeet28")  # User's actual password
DB_NAME = os.environ.get("DB_NAME", "mindalert_db")

# Gemini Setup (Optional, falls back if key is invalid/missing)
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# --- DATABASE CONNECTION HELPER ---
def get_db_connection():
    try:
        return mysql.connector.connect(
            host=DB_HOST, user=DB_USER, password=DB_PASSWORD, database=DB_NAME
        )
    except mysql.connector.Error as err:
        print(f"Error connecting to DB: {err}")
        return None

# --- AUTHENTICATION ROUTES ---
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400
        
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database error"}), 500
        
    try:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO users (email, password) VALUES (%s, %s)", (email, password))
        conn.commit()
        user_id = cursor.lastrowid
        return jsonify({"message": "Signup successful", "user_id": user_id}), 201
    except mysql.connector.Error as err:
        if err.errno == 1062: # Duplicate entry
            return jsonify({"error": "Email already exists"}), 400
        return jsonify({"error": "Signup failed"}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database error"}), 500
        
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id FROM users WHERE email=%s AND password=%s", (email, password))
        user = cursor.fetchone()
        
        if user:
            return jsonify({"message": "Login successful", "user_id": user['id']}), 200
        else:
            return jsonify({"error": "Invalid email or password"}), 401
    finally:
        cursor.close()
        conn.close()

import json

# --- FATIGUE LOGIC & PREDICTION ---
def get_recommendation(fatigue, sleep, study, screen, stress):
    """Generates the recommendation using Gemini AI if available, else uses defaults."""
    import re
    
    fallback = {
        "suggestion": "Take rest and stay hydrated.",
        "summary": "You may be experiencing fatigue due to imbalance in routine.",
        "quote": "Rest if you must, but don’t quit."
    }

    # Try AI First
    if GEMINI_API_KEY:
        try:
            print(f"DEBUG: Authenticating with Gemini API Key (Length: {len(GEMINI_API_KEY)})")
            model = genai.GenerativeModel('gemini-2.5-flash')
            prompt = f"""Student Data:
Sleep: {sleep} hours
Study: {study} hours
Screen Time: {screen} hours
Stress: {stress}/10
Fatigue: {fatigue}

Give:
1. One short practical suggestion
2. One-line summary of condition
3. One motivational quote

Return ONLY valid JSON in this exact format:
{{
"suggestion": "...",
"summary": "...",
"quote": "..."
}}
Do not include markdown or extra text."""
            
            response = model.generate_content(prompt)
            print("Gemini RAW:", response.text)
            
            # Safe JSON Extraction via Regex
            match = re.search(r'\{.*\}', response.text, re.DOTALL)
            if match:
                ai_data = json.loads(match.group(0))
                
                # Ensure keys exist before returning
                if 'suggestion' in ai_data and 'summary' in ai_data and 'quote' in ai_data:
                    return ai_data
            else:
                print("Gemini error: No valid JSON block found in response.")
        except Exception as e:
            print(f"Gemini error: {e}")
            pass # Fallback to default if API fails
            
    return fallback

@app.route('/predict', methods=['POST'])
def predict_fatigue():
    data = request.json
    user_id = data.get('user_id')
    sleep = float(data.get('sleep', 0))
    study = float(data.get('study', 0))
    screen = float(data.get('screen', 0))
    stress = int(data.get('stress', 0))
    
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400
    
    # Simple Logic Rule
    if sleep < 5 and screen > 8:
        fatigue = "HIGH"
        msg = "High fatigue detected"
    elif sleep < 7:
        fatigue = "MEDIUM"
        msg = "Slight fatigue detected"
    else:
        fatigue = "LOW"
        msg = "You are doing well"
        
    rec_dict = get_recommendation(fatigue, sleep, study, screen, stress)
    rec_str = json.dumps(rec_dict)
    
    # Save to Database
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            query = """INSERT INTO user_logs 
                       (user_id, sleep_hours, study_hours, screen_time, stress_level, fatigue_result, recommendation) 
                       VALUES (%s, %s, %s, %s, %s, %s, %s)"""
            cursor.execute(query, (user_id, sleep, study, screen, stress, fatigue, rec_str))
            conn.commit()
        except Exception as e:
            print(f"DB Insert Error: {e}")
        finally:
            cursor.close()
            conn.close()
            
    return jsonify({
        "fatigue": fatigue,
        "message": msg,
        "recommendation": rec_dict
    })

@app.route('/history', methods=['GET'])
def get_history():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"error": "User ID required"}), 400
        
    conn = get_db_connection()
    if not conn:
        return jsonify([]), 500
        
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM user_logs WHERE user_id=%s ORDER BY created_at DESC LIMIT 5", (user_id,))
        records = cursor.fetchall()
        return jsonify(records)
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    app.run(debug=True, port=5000)

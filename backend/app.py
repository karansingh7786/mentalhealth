from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import google.generativeai as genai
import json
import re
import datetime
import psycopg2
import pytz
load_dotenv()  # Load variables from .env file
ist = pytz.timezone('Asia/Kolkata')

app = Flask(__name__)
CORS(app)

# Gemini Setup
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

def get_db_connection():
    return psycopg2.connect(
        host=os.environ.get("DB_HOST"),
        database=os.environ.get("DB_NAME"),
        user=os.environ.get("DB_USER"),
        password=os.environ.get("DB_PASSWORD"),
        port=os.environ.get("DB_PORT")
    )

# --- AUTHENTICATION ROUTES ---
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400
        
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Check if email exists
        cur.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cur.fetchone():
            return jsonify({"error": "Email already exists"}), 400
            
        # Insert new user
        cur.execute(
            "INSERT INTO users (email, password) VALUES (%s, %s) RETURNING id",
            (email, password)
        )
        user_id = cur.fetchone()[0]
        conn.commit()
        
        return jsonify({"message": "Signup successful", "user_id": user_id}), 201
    except psycopg2.Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            cur.close()
            conn.close()

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("SELECT id FROM users WHERE email = %s AND password = %s", (email, password))
        user = cur.fetchone()
        
        if user:
            return jsonify({"message": "Login successful", "user_id": user[0]}), 200
        else:
            return jsonify({"error": "Invalid email or password"}), 401
    except psycopg2.Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            cur.close()
            conn.close()

# --- FATIGUE LOGIC & PREDICTION ---
def get_recommendation(fatigue, sleep, study, screen, stress):
    """Generates the recommendation using Gemini AI if available, else uses defaults."""
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
    
    created_at = datetime.datetime.now(ist).strftime("%Y-%m-%d %H:%M:%S")
    
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Insert log into DB
        cur.execute(
            """INSERT INTO user_logs 
               (user_id, sleep_hours, study_hours, screen_time, stress_level, fatigue_result, recommendation, created_at) 
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
            (user_id, sleep, study, screen, stress, fatigue, rec_str, created_at)
        )
        conn.commit()
        
        return jsonify({
            "fatigue": fatigue,
            "message": msg,
            "recommendation": rec_dict
        })
    except psycopg2.Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            cur.close()
            conn.close()

@app.route('/history', methods=['GET'])
def get_history():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"error": "User ID required"}), 400
        
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute(
            """SELECT id, user_id, sleep_hours, study_hours, screen_time, stress_level, fatigue_result, recommendation, created_at 
               FROM user_logs 
               WHERE user_id = %s 
               ORDER BY created_at DESC 
               LIMIT 5""",
            (user_id,)
        )
        rows = cur.fetchall()
        
        history = []
        for row in rows:
            history.append({
                "id": row[0],
                "user_id": row[1],
                "sleep_hours": row[2],
                "study_hours": row[3],
                "screen_time": row[4],
                "stress_level": row[5],
                "fatigue_result": row[6],
                "recommendation": row[7],
                "created_at": str(row[8]) if row[8] else None
            })
            
        return jsonify(history)
    except psycopg2.Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            cur.close()
            conn.close()

@app.route('/', methods=['GET'])
def index():
    return jsonify({"status": "MindAlert API is running with PostgreSQL!"})

if __name__ == '__main__':
    # Running on port 5000 as typical for Flask REST APIs
    app.run(debug=True, port=5000)

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import google.generativeai as genai
import json
import re
import datetime

load_dotenv()  # Load variables from .env file

app = Flask(__name__)
CORS(app)

# --- IN-MEMORY DATABASE (FOR DEMO PURPOSES) ---
# This replaces MySQL/PostgreSQL so the app runs instantly anywhere
USERS = {}        # Maps email -> {"id": 1, "password": "...", "email": "..."}
USER_LOGS = []    # List of prediction log dictionaries
next_user_id = 1
next_log_id = 1

# Gemini Setup
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# --- AUTHENTICATION ROUTES ---
@app.route('/signup', methods=['POST'])
def signup():
    global next_user_id
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400
        
    if email in USERS:
        return jsonify({"error": "Email already exists"}), 400
        
    # Store user in memory
    user_id = next_user_id
    USERS[email] = {
        "id": user_id,
        "email": email,
        "password": password
    }
    next_user_id += 1
    
    return jsonify({"message": "Signup successful", "user_id": user_id}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if email in USERS and USERS[email]['password'] == password:
        return jsonify({"message": "Login successful", "user_id": USERS[email]['id']}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401

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
    global next_log_id
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
    
    # Save to In-Memory Database (Prepend so newest is first)
    log_entry = {
        "id": next_log_id,
        "user_id": int(user_id),
        "sleep_hours": sleep,
        "study_hours": study,
        "screen_time": screen,
        "stress_level": stress,
        "fatigue_result": fatigue,
        "recommendation": rec_str,
        "created_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    USER_LOGS.insert(0, log_entry)
    next_log_id += 1
            
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
        
    try:
        uid = int(user_id)
        # Filter logs corresponding to this user
        user_specific_logs = [log for log in USER_LOGS if log["user_id"] == uid]
        
        # Return top 5 logs (already sorted descending because we used insert(0))
        return jsonify(user_specific_logs[:5])
    except Exception as e:
        return jsonify({"error": "Failed to fetch history"}), 500

@app.route('/', methods=['GET'])
def index():
    return jsonify({"status": "MindAlert API is running completely In-Memory!"})

if __name__ == '__main__':
    # Running on port 5000 as typical for Flask REST APIs
    app.run(debug=True, port=5000)

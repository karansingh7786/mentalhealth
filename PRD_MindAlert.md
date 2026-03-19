# MindAlert — AI-Based Mental Fatigue & Stress Detection System

## 1. Problem Statement
Engineering students face high stress due to long study hours, lack of adequate sleep, and continuous screen exposure. This combination frequently leads to fatigue, decreased academic performance, and severe burnout. Current solutions for tracking mental well-being are mostly manual (e.g., journaling or self-reporting), which are often subjective, inconsistent, and not accurate enough to provide timely warnings.

## 2. Proposed Solution
Design an intelligent AI system that takes user inputs (such as daily study hours, sleep duration, screen time, and self-reported stress levels) and optionally utilizes webcam data (monitoring eye blinks, yawning, and facial expressions) to detect and predict the user's fatigue level accurately.

## 3. Working Mechanism
* **Data Input:** The user enters their daily metrics, including sleep hours, study hours, and perceived stress level.
* **Processing:** The system processes this structured data (and optional real-time video feed) using a trained Machine Learning model.
* **Output Generation:** The system calculates and outputs a real-time fatigue level categorized as **Low**, **Medium**, or **High**.
* **Alert System:** If the predicted fatigue level is High, the system immediately triggers a visual/audio alert customized with actionable advice.

## 4. Key Features
* **Real-time Fatigue Detection:** Continuous or instant assessment of mental exhaustion based on provided metrics.
* **Simple User Input Form:** A clean, intuitive dashboard interface for students to log their daily activities quickly.
* **Status Dashboard:** A visual representation of the user’s current fatigue status, historical trends, and daily logs.
* **Alerts & Suggestions:** Context-aware prompts such as "Take a 15-minute break," "Prioritize 8 hours of sleep," or "Hydrate now" when fatigue levels spike.

## 5. System Architecture
* **Inputs:** 
  * Manual Data: Study hours, Sleep hours, Screen time, Subjective stress rating.
  * Automated Data (Optional): Webcam feed for behavioral cues (eye aspect ratio, yawn frequency).
* **Processing Module:** A Machine Learning backend (e.g., Random Forest or Support Vector Machine) that identifies patterns correlating to high fatigue.
* **Output & Notification Module:** A frontend interface displaying the Fatigue Level and an Alert Management mechanism.

## 6. Technology Stack
* **Programming Language:** Python
* **User Interface:** Tkinter (for desktop application) or Streamlit (for web-based dashboard)
* **Machine Learning:** Scikit-learn (to build and evaluate the predictive model)
* **Computer Vision (Optional):** OpenCV, Dlib, or MediaPipe (for real-time facial feature extraction and face detection)

## 7. Example Flow
* **User Input:**
  * Sleep = 4 hours
  * Study = 8 hours
  * Screen time = 10 hours
* **System Processing:** ML model processes parameters...
* **Output:**
  * Fatigue Level = **HIGH**
  * Alert Generated = *"Critical Fatigue Detected: Take rest immediately to prevent burnout."*

## 8. Advantages
* **Easy to Use:** Requires minimal effort from the user to input data.
* **Real-Time Detection:** Offers immediate feedback rather than retrospective analysis.
* **Burnout Prevention:** Acts as an early warning system, helping students manage their workload and prioritize their health.

## 9. Limitations
* **Accuracy Dependency:** The prediction heavily relies on the honesty and accuracy of the user's manual inputs.
* **Not a Medical Tool:** The system serves as a wellness indicator and is not a substitute for professional medical diagnosis or psychiatric help.

## 10. Future Scope
* **Mobile App Integration:** Developing Android/iOS versions for on-the-go tracking.
* **Smartwatch/Wearable Integration:** Syncing heart rate, sleep data, and HRV (Heart Rate Variability) from wearables for automated input gathering.
* **Predictive AI Analytics:** Forecasting burnout *before* severe fatigue occurs using historical data trends and advanced deep learning models.

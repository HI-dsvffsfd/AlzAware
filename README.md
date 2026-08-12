# AlzAware Project Instruction

## Overview

AlzAware is an educational cognitive risk reference tool. It collects questionnaire information and self-reported medical history, sends it to a cloud prediction service, and returns a model-based reference score compared with AD and non-AD reference populations.

AlzAware is not a medical device and does not provide diagnosis, medical advice, treatment recommendations, or emergency services.

## Main Features

- Mobile app built with React Native and Expo
- Flask backend prediction API
- XGBoost-based reference model
- Web assessment page served by Flask/Render
- Web training page served by Flask/Render
- Brain Training activities:
  - Pattern Recall
  - Quick Match
  - Color Focus
- Wix public website for homepage, about, privacy policy, and contact pages
- Render backend deployment
- Android production build through EAS Build

## Technology Stack

### Mobile App

- React Native
- Expo
- React Navigation
- EAS Build

### Backend

- Python
- Flask
- Gunicorn
- pandas
- numpy
- joblib
- scikit-learn
- xgboost-cpu

### Hosting

- Render for backend and interactive web pages
- Wix for public website pages
- Google Play Console for Android release

## Important Files

### App Files

- `App.js`: Main navigation structure, onboarding flow, bottom tabs, and stacks.
- `src/screens/HomeScreen.js`: Main home screen.
- `src/screens/AssessmentScreen.js`: Questionnaire and API request logic.
- `src/screens/ResultScreen.js`: Displays model result and training suggestion.
- `src/screens/TrainingScreen.js`: Brain training games and review logic.
- `src/screens/DisclaimerScreen.js`: Pre-assessment disclaimer.
- `src/screens/PrivacyPolicyScreen.js`: In-app privacy policy.
- `src/screens/AboutScreen.js`: App explanation.
- `src/screens/SettingsScreen.js`: Settings and policy links.
- `assets/icon.png`: App icon/logo.

### Backend Files

- `app.py`: Flask app, model loading, feature preparation, routes, and `/predict`.
- `requirements.txt`: Python dependencies.
- `final_model_matrix_data24.csv`: Reference/model matrix data.
- `reference_scores_24.joblib`: Precomputed reference score distribution.
- `my_python/xgb_without_game/xgb_final_model_24.joblib`: Trained model file.
- `templates/test.html`: Web assessment page.
- `templates/training.html`: Web training page, if included.

## Mac Setup

Install the following:

- Git
- Node.js LTS
- Python 3.12
- VS Code or PyCharm
- EAS CLI
- Optional: Android Studio for emulator testing

## Backend Setup

From the backend project folder:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Production API:

```text
https://alzaware.onrender.com/predict
```

## Mobile App Setup

Install "Expo Go" in your mobile. This is a software for development testing. 

From the mobile app project folder:

```bash
npm install
npx expo start
```
Then scan the QR code by your camera, it leads you to Expo. Be sure your computer and mobile are in the same Wifi, otherwise it won't work. 

For production, `AssessmentScreen.js` should use:

```js
const API_URL = "https://alzaware.onrender.com/predict";
```

For local backend testing, replace it with the local network IP, for example:

```js
const API_URL = "http://192.168.x.x:5000/predict";
```

## Website Notes

The Wix website is used for public-facing pages such as:

- Home
- About
- Privacy Policy
- Contact

Interactive pages can be hosted through Render and linked from Wix, for example:

```text
https://alzaware.onrender.com/test
https://alzaware.onrender.com/training
```

- Avoid giving `Admin` access unless they need to manage repository settings or deployment configuration.

Render will clone the full repository during deployment, but it will only run the configured backend command. Extra mobile app files or documentation files will not automatically become public web pages unless Flask routes expose them.

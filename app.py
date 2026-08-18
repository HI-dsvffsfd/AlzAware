from pathlib import Path
import os

import joblib
import numpy as np
import pandas as pd
from flask import Flask, jsonify, render_template, request

BASE_DIR = Path(__file__).resolve().parent

# MODEL_WITH_GAME_PATH = Path(
#     os.getenv(
#         "MODEL_WITH_GAME_PATH",
#         # BASE_DIR / "xgb_matrix_output" / "with_game_26" / "xgb_with_game_26.joblib"
#         # BASE_DIR / "logistic_outputs" / "20260715_111526" / "logistic_with_game.joblib"
#         BASE_DIR / "my_python" / "xgb_with_game" / "xgb_final_model_26.joblib"
#     )
# )

MODEL_PATH = Path(
    os.getenv(
        "MODEL_PATH",
        # BASE_DIR / "xgb_matrix_output" / "without_game_24" / "xgb_without_game_24.joblib"
        # BASE_DIR / "logistic_outputs" / "20260715_111526" / "logistic_without_game.joblib"
        BASE_DIR / "my_python" / "xgb_without_game" / "xgb_final_model_24.joblib"
    )
)

DATA_PATH = BASE_DIR / "final_model_matrix_data24.csv"
OUTCOME_COL = "alzheimer"

BOOL_COLS = [
    "cancer", "depression_anxiety", "hypertension", "loss_of_consciousness",
    "memory_problems", "seizures", "smoking", "type_1_diabetes",
    "no_conditions", "brain_disease", "chronic_stress", "heart_disease",
    "parkinsons_disease", "sleep_problems", "stroke", "type_2_diabetes"
]

NUMERIC_COLS = ["age"]

app = Flask(__name__)


def normalize_column_names(df):
    df = df.copy()
    df.columns = (
        df.columns.astype(str)
        .str.strip()
        .str.replace(r"\s+", "_", regex=True)
        .str.lower()
    )
    return df


def normalize_bool(value):
    if value is None or value == "":
        return np.nan

    text = str(value).strip().lower()

    if text in {"true", "t", "yes", "y", "1"}:
        return 1.0
    if text in {"false", "f", "no", "n", "0"}:
        return 0.0

    return np.nan


def normalize_numeric(value):
    return pd.to_numeric(pd.Series([value]), errors="coerce").iloc[0]


def load_model(model_path):
    bundle = joblib.load(model_path)

    if isinstance(bundle, dict):
        model = bundle.get("model") or bundle.get("pipeline")
        features = bundle.get("features") or bundle.get("feature_cols")
    else:
        model = bundle
        features = getattr(model, "feature_names_in_", None)
        if features is not None:
            features = list(features)

    if features is None:
        feature_df = pd.read_csv(DATA_PATH, nrows=1)
        features = [col for col in feature_df.columns if col != OUTCOME_COL]

    if model is None:
        raise ValueError(f"Could not load model from {model_path}")

    return model, features


def prepare_features(df, features):
    df = df.copy()

    for col in features:
        if col not in df.columns:
            df[col] = 0

    x = df[features].apply(pd.to_numeric, errors="coerce").fillna(0)

    return x


def prepare_user_input(payload, features):
    row = {feature: 0 for feature in features}

    age = normalize_numeric(payload.get("age"))
    if "age" in row:
        row["age"] = age

    if not pd.isna(age):
        age = float(age)
        if 20 <= age < 30 and "age_decade20.29" in row:
            row["age_decade20.29"] = 1
        elif 30 <= age < 40 and "age_decade30.39" in row:
            row["age_decade30.39"] = 1
        elif 40 <= age < 50 and "age_decade40.49" in row:
            row["age_decade40.49"] = 1
        elif 50 <= age < 60 and "age_decade50.59" in row:
            row["age_decade50.59"] = 1
        elif 60 <= age < 70 and "age_decade60.69" in row:
            row["age_decade60.69"] = 1
        elif 70 <= age < 80 and "age_decade70.79" in row:
            row["age_decade70.79"] = 1
        elif age >= 80 and "age_decade80." in row:
            row["age_decade80."] = 1

    if payload.get("sex") == "Male" and "sexMale" in row:
        row["sexMale"] = 1

    race_map = {
        "Asian": "raceAsian",
        "Black or African American": "raceBlack.or.African.American",
        "I prefer not to answer": "raceI.prefer.not.to.answer",
        "More than one race": "raceMultiracial.or.Mixed.Race",
        "Multiracial or Mixed Race": "raceMultiracial.or.Mixed.Race",
        "Native Hawaiian or Other Pacific Islander": "raceNative.Hawaiian.or.Other.Pacific.Islander",
        "White": "raceWhite",
    }
    race_col = race_map.get(payload.get("race"))
    if race_col in row:
        row[race_col] = 1

    hispanic_map = {
        "Yes": "hispanic_latinoYes",
        "Prefer not to answer": "hispanic_latinoPrefer.not.to.answer",
    }
    hispanic_col = hispanic_map.get(payload.get("hispanic_latino"))
    if hispanic_col in row:
        row[hispanic_col] = 1

    medication_map = {
        "None": "number_of_daily_medicationsNone",
        "One": "number_of_daily_medicationsOne",
        "Two": "number_of_daily_medicationsTwo",
        "Three": "number_of_daily_medicationsThree",
    }
    medication_col = medication_map.get(payload.get("number_of_daily_medications"))
    if medication_col in row:
        row[medication_col] = 1

    handedness_map = {
        "left": "handednessleft",
        "right": "handednessright",
    }
    handedness_col = handedness_map.get(payload.get("handedness"))
    if handedness_col in row:
        row[handedness_col] = 1

    education_map = {
        "Completed 8th Grade (Elementary or Primary School Graduate)": "highest_education_level_completedCompleted.8th.Grade..Elementary.or.Primary.School.Graduate.",
        "High School Diploma (Baccalaureate)": "highest_education_level_completedHigh.School.Diploma..Baccalaureate.",
        "Post Graduate Degree (Masters or Doctorate)": "highest_education_level_completedPost.Graduate.Degree..Masters.or.Doctorate.",
        "Some College (Some University)": "highest_education_level_completedSome.College..Some.University.",
        "Some High School": "highest_education_level_completedSome.High.School",
        "Up to 8 Years": "highest_education_level_completedUp.to.8.Years",
    }
    education_col = education_map.get(payload.get("highest_education_level_completed"))
    if education_col in row:
        row[education_col] = 1

    selected_medical_count = 0

    for col in BOOL_COLS:
        if col == "no_conditions":
            continue

        matrix_col = f"{col}TRUE"
        if matrix_col in row and normalize_bool(payload.get(col)) == 1.0:
            row[matrix_col] = 1
            selected_medical_count += 1

    if selected_medical_count == 0 and "no_conditionsTRUE" in row:
        row["no_conditionsTRUE"] = 1

    return pd.DataFrame([row])[features]


def load_reference_scores(model, features):
    df = pd.read_csv(DATA_PATH)

    df[OUTCOME_COL] = (
        df[OUTCOME_COL]
        .astype(str)
        .str.strip()
        .str.lower()
        .map({
            "yes": 1,
            "y": 1,
            "true": 1,
            "1": 1,
            "no": 0,
            "n": 0,
            "false": 0,
            "0": 0,
        })
    )

    df = df.dropna(subset=[OUTCOME_COL]).copy()
    df[OUTCOME_COL] = df[OUTCOME_COL].astype(int)

    x = prepare_features(df, features)
    df["model_score"] = model.predict_proba(x)[:, 1]

    ad_scores = df.loc[df[OUTCOME_COL] == 1, "model_score"].dropna().to_numpy()
    non_ad_scores = df.loc[df[OUTCOME_COL] == 0, "model_score"].dropna().to_numpy()

    return {
        "ad_scores": ad_scores,
        "non_ad_scores": non_ad_scores,
        "n_ad": int(len(ad_scores)),
        "n_non_ad": int(len(non_ad_scores)),
    }


# MODEL_WITH_GAME, FEATURES_WITH_GAME = load_model(MODEL_WITH_GAME_PATH, include_game=True)
# MODEL_WITHOUT_GAME, FEATURES_WITHOUT_GAME = load_model(MODEL_WITHOUT_GAME_PATH, include_game=False)
#
# REFERENCE_WITH_GAME = load_reference_scores(MODEL_WITH_GAME, FEATURES_WITH_GAME)
# REFERENCE_WITHOUT_GAME = load_reference_scores(MODEL_WITHOUT_GAME, FEATURES_WITHOUT_GAME)

# MODEL, FEATURES = load_model(MODEL_PATH)
# REFERENCE = load_reference_scores(MODEL, FEATURES)
REFERENCE_PATH = BASE_DIR / "reference_scores_24.joblib"
MODEL, FEATURES = load_model(MODEL_PATH)
REFERENCE = joblib.load(REFERENCE_PATH)

@app.route("/")
def intro():
    return jsonify({
        "service": "AlzAware prediction API",
        "status": "ok",
        "endpoints": ["/health", "/predict", "/training"]
    })


@app.route("/health")
def health():
    return jsonify({"status": "ok"})


@app.route("/test")
def test():
    return render_template("test.html")

@app.route("/training")
def training():
    return render_template("training.html")

@app.route("/predict", methods=["POST"])
def predict():
    payload = request.get_json()

    # attnrt_value = normalize_numeric(payload.get("attnrt_median"))
    # totalcorrect_value = normalize_numeric(payload.get("totalcorrect"))
    #
    # use_game_model = not pd.isna(attnrt_value) and not pd.isna(totalcorrect_value)
    #
    # if use_game_model:
    #     model = MODEL_WITH_GAME
    #     features = FEATURES_WITH_GAME
    #     reference = REFERENCE_WITH_GAME
    #     model_used = "xgb_pipeline_all_variables.joblib"
    # else:
    #     model = MODEL_WITHOUT_GAME
    #     features = FEATURES_WITHOUT_GAME
    #     reference = REFERENCE_WITHOUT_GAME
    #     model_used = "xgb_pipeline_without_game.joblib"

    model = MODEL
    features = FEATURES
    reference = REFERENCE
    model_used = "xgb_final_model_24.joblib"

    user_df = prepare_user_input(payload, features)
    user_score = float(model.predict_proba(user_df)[0, 1])

    ad_greater_percent = float((reference["ad_scores"] > user_score).mean() * 100)
    non_ad_greater_percent = float((reference["non_ad_scores"] > user_score).mean() * 100)

    return jsonify({
        "score": user_score,
        "model_used": model_used,
        "ad_greater_percent": round(ad_greater_percent, 1),
        "non_ad_greater_percent": round(non_ad_greater_percent, 1),
        "ad_lower_or_equal_percent": round(100 - ad_greater_percent, 1),
        "non_ad_lower_or_equal_percent": round(100 - non_ad_greater_percent, 1),
        "n_ad": reference["n_ad"],
        "n_non_ad": reference["n_non_ad"],
    })

# if __name__ == "__main__":
#     # print(f"Using model with game: {MODEL_WITH_GAME_PATH}")
#     # print(f"Using model without game: {MODEL_WITHOUT_GAME_PATH}")
#     print(f"Using model: {MODEL_PATH}")
#     print(f"Using reference data: {DATA_PATH}")
#     # app.run(host="127.0.0.1", port=5000, debug=True)
#     app.run(host="0.0.0.0", port=5000, debug=True)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"Using model: {MODEL_PATH}")
    print(f"Using reference data: {DATA_PATH}")
    app.run(host="0.0.0.0", port=port, debug=False)

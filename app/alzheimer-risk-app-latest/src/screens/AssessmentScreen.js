import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const API_URL = "https://alzaware.onrender.com/predict";
const PRIMARY = "#0f766e";

const medicalFields = [
  ["cancer", "Cancer"],
  ["depression_anxiety", "Depression or Anxiety"],
  ["hypertension", "Hypertension"],
  ["loss_of_consciousness", "Loss of Consciousness"],
  ["memory_problems", "Memory Problems"],
  ["seizures", "Seizures"],
  ["smoking", "Smoking"],
  ["type_1_diabetes", "Type 1 Diabetes"],
  ["brain_disease", "Brain Disease"],
  ["chronic_stress", "Chronic Stress"],
  ["heart_disease", "Heart Disease"],
  ["parkinsons_disease", "Parkinson's Disease"],
  ["sleep_problems", "Sleep Problems"],
  ["stroke", "Stroke"],
  ["type_2_diabetes", "Type 2 Diabetes"],
  ["no_conditions", "No Listed Conditions"]
];

const initialForm = {
  age: "",
  sex: "",
  race: "",
  hispanic_latino: "",
  number_of_daily_medications: "",
  handedness: "",
  highest_education_level_completed: "",

  cancer: "",
  depression_anxiety: "",
  hypertension: "",
  loss_of_consciousness: "",
  memory_problems: "",
  seizures: "",
  smoking: "",
  type_1_diabetes: "",
  brain_disease: "",
  chronic_stress: "",
  heart_disease: "",
  parkinsons_disease: "",
  sleep_problems: "",
  stroke: "",
  type_2_diabetes: "",
  no_conditions: ""
};

const questionPages = [
  {
    key: "age",
    title: "What is your age?",
    subtitle: "Enter your age in years.",
    type: "number",
    placeholder: "Example: 71",
    required: true
  },
  {
    key: "sex",
    title: "What is your sex?",
    type: "choice",
    required: true,
    options: ["Female", "Male"]
  },
  {
    key: "race",
    title: "What is your race?",
    type: "choice",
    required: true,
    options: [
      "White",
      "Black or African American",
      "Asian",
      "Native Hawaiian or Other Pacific Islander",
      "American Indian or Alaska Native",
      "Multiracial or Mixed Race",
      "I prefer not to answer"
    ]
  },
  {
    key: "hispanic_latino",
    title: "Are you Hispanic or Latino?",
    type: "choice",
    required: true,
    options: ["No", "Yes", "Prefer not to answer"]
  },
  {
    key: "number_of_daily_medications",
    title: "How many medications do you take daily?",
    type: "choice",
    required: true,
    options: ["None", "One", "Two", "Three", "More than three"]
  },
  {
    key: "handedness",
    title: "Which hand do you usually use?",
    type: "choice",
    required: true,
    options: ["right", "left", "both"]
  },
  {
    key: "highest_education_level_completed",
    title: "What is your highest education level?",
    type: "choice",
    required: true,
    options: [
      "Up to 8 Years",
      "Completed 8th Grade (Elementary or Primary School Graduate)",
      "Some High School",
      "High School Diploma (Baccalaureate)",
      "Some College (Some University)",
      "College Degree (University Graduate)",
      "Post Graduate Degree (Masters or Doctorate)"
    ]
  },
  {
    key: "medical_history",
    title: "Medical History",
    subtitle: 'Check all that apply. Select "No Listed Conditions" if none apply.',
    type: "medical"
  }
];

export default function AssessmentScreen({ navigation, route }) {
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const insets = useSafeAreaInsets();

  const currentPage = questionPages[step];
  const isLastStep = step === questionPages.length - 1;

  useEffect(() => {
    if (route.params?.resetForm) {
      setForm(initialForm);
      setStep(0);
      setError("");
      setLoading(false);
    }
  }, [route.params?.resetForm]);

  const updateField = (name, value) => {
    setForm((current) => ({
      ...current,
      [name]: value
    }));
  };

  const toggleMedicalField = (name) => {
    setForm((current) => {
      const nextValue = current[name] === "TRUE" ? "FALSE" : "TRUE";
      const updated = {
        ...current,
        [name]: nextValue
      };

      if (name === "no_conditions" && nextValue === "TRUE") {
        medicalFields.forEach(([fieldName]) => {
          if (fieldName !== "no_conditions") {
            updated[fieldName] = "FALSE";
          }
        });
      }

      if (name !== "no_conditions" && nextValue === "TRUE") {
        updated.no_conditions = "FALSE";
      }

      const hasAnyCondition = medicalFields.some(([fieldName]) => {
        return fieldName !== "no_conditions" && updated[fieldName] === "TRUE";
      });

      if (!hasAnyCondition && updated.no_conditions !== "TRUE") {
        updated.no_conditions = "TRUE";
      }

      return updated;
    });
  };

  const validateCurrentStep = () => {
    setError("");

    if (!currentPage.required) {
      return true;
    }

    const value = form[currentPage.key];

    if (value === undefined || value === null || String(value).trim() === "") {
      setError("Please answer this question before continuing.");
      return false;
    }

    if (currentPage.key === "age") {
      const age = Number(value);
      if (!Number.isFinite(age) || age < 18 || age > 110) {
        setError("Please enter an age between 18 and 110.");
        return false;
      }
    }

    return true;
  };

  const goNext = () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (isLastStep) {
      submit();
      return;
    }

    setStep((current) => current + 1);
  };

  const goBack = () => {
    setError("");

    if (step > 0) {
      setStep((current) => current - 1);
      return;
    }

    navigation.goBack();
  };

  const submit = async () => {
    setError("");
    setLoading(true);

    const payload = { ...form };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Prediction request failed.");
      }

      const data = await response.json();
      navigation.replace("Result", {
        result: data,
        resultKey: Date.now()
      });
    } catch (err) {
      setError(
        "Prediction failed. Please check that the Python backend is running and API_URL is correct."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <StatusBar barStyle="dark-content" />

        <View style={styles.progressWrap}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${((step + 1) / questionPages.length) * 100}%` }
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            Question {step + 1} of {questionPages.length}
          </Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.questionCard}>
            <Text style={styles.title}>{currentPage.title}</Text>

            {currentPage.subtitle ? (
              <Text style={styles.subtitle}>{currentPage.subtitle}</Text>
            ) : null}

            {currentPage.type === "number" ? (
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={form[currentPage.key]}
                onChangeText={(value) => updateField(currentPage.key, value)}
                placeholder={currentPage.placeholder}
              />
            ) : null}

            {currentPage.type === "choice" ? (
              <ChoiceList
                value={form[currentPage.key]}
                options={currentPage.options}
                onValueChange={(value) => updateField(currentPage.key, value)}
              />
            ) : null}

            {currentPage.type === "medical" ? (
              <View style={styles.choiceGroup}>
                {medicalFields.map(([name, label]) => (
                  <MedicalCheckboxField
                    key={name}
                    label={label}
                    checked={form[name] === "TRUE"}
                    onPress={() => toggleMedicalField(name)}
                  />
                ))}
              </View>
            ) : null}

            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>
        </ScrollView>

        <View style={[styles.actions, { paddingBottom: insets.bottom + 14 }]}>
          <Pressable style={[styles.actionButton, styles.backButton]} onPress={goBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>

          <Pressable
            style={[styles.actionButton, styles.nextButton]}
            onPress={goNext}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.nextButtonText}>
                {isLastStep ? "Calculate" : "Continue"}
              </Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ChoiceList({ value, options, onValueChange }) {
  return (
    <View style={styles.choiceGroup}>
      {options.map((option) => {
        const selected = value === option;

        return (
          <Pressable
            key={option}
            style={[styles.choiceRow, selected && styles.choiceRowChecked]}
            onPress={() => onValueChange(option)}
          >
            <View style={[styles.radio, selected && styles.radioChecked]}>
              {selected ? <View style={styles.radioDot} /> : null}
            </View>
            <Text style={styles.choiceText}>{option}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function MedicalCheckboxField({ label, checked, onPress }) {
  return (
    <Pressable
      style={[styles.choiceRow, checked && styles.choiceRowChecked]}
      onPress={onPress}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked ? <Text style={styles.checkboxMark}>✓</Text> : null}
      </View>
      <Text style={styles.choiceText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f6faf9"
  },
  screen: {
    flex: 1,
    backgroundColor: "#f6faf9"
  },
  progressWrap: {
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: "#f6faf9"
  },
  progressTrack: {
    height: 7,
    borderRadius: 999,
    backgroundColor: "#dbe7e5",
    overflow: "hidden",
    marginBottom: 8
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: PRIMARY
  },
  progressText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748b",
    textAlign: "center"
  },
  scroll: {
    flex: 1
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 30,
    paddingBottom: 28,
    justifyContent: "center"
  },
  questionCard: {
    width: "100%",
    alignSelf: "center"
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "800",
    color: "#102a43",
    marginBottom: 12,
    textAlign: "center"
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#64748b",
    marginBottom: 22,
    textAlign: "center"
  },
  input: {
    minHeight: 58,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    fontSize: 18,
    textAlign: "center"
  },
  choiceGroup: {
    gap: 10
  },
  choiceRow: {
    width: "100%",
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    backgroundColor: "#ffffff"
  },
  choiceRowChecked: {
    backgroundColor: "#ecfdf5",
    borderColor: PRIMARY
  },
  radio: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#94a3b8",
    borderRadius: 999,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  radioChecked: {
    borderColor: PRIMARY
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: PRIMARY
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: "#94a3b8",
    borderRadius: 4,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  checkboxChecked: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY
  },
  checkboxMark: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800"
  },
  choiceText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    color: "#1f2937"
  },
  error: {
    backgroundColor: "#fef2f2",
    color: "#991b1b",
    borderColor: "#fecaca",
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    marginTop: 18,
    fontSize: 14,
    lineHeight: 20
  },
  actions: {
    flexDirection: "row",
    gap: 14,
    paddingHorizontal: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#dbe7e5",
    backgroundColor: "#ffffff"
  },
  actionButton: {
    flex: 1,
    minHeight: 58,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center"
  },
  backButton: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: PRIMARY
  },
  nextButton: {
    backgroundColor: PRIMARY
  },
  backButtonText: {
    color: PRIMARY,
    fontSize: 18,
    fontWeight: "800"
  },
  nextButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800"
  }
});
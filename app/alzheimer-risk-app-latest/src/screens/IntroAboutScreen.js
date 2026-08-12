import React from "react";
import { StyleSheet, Text } from "react-native";
import OnboardingLayout from "./OnboardingLayout";

export default function IntroAboutScreen({ navigation }) {
  return (
    <OnboardingLayout
      title="What does this app offer?"
      onNext={() => navigation.navigate("DiseaseOverview")}
    >
        <Text style={styles.text}>
          This app provides a cognitive risk reference score using questionnaire
          information and self-reported medical history.
        </Text>

        <Text style={styles.text}>
          Instead of giving a diagnosis, it compares your model score with scores
          from people with Alzheimer's disease (AD) and people without AD in a
          reference dataset.
        </Text>

        <Text style={styles.warning}>
          This app is for educational and reference purposes only. It is not a
          medical device and does not diagnose, treat, cure, or prevent any medical
          condition.
        </Text>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  text: { fontSize: 20, lineHeight: 30, color: "#1f2937", marginBottom: 18 },
  warning: { fontSize: 17, lineHeight: 25, color: "#991b1b", marginTop: 10 }
});
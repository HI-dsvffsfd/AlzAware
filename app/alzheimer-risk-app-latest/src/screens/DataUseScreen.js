import React from "react";
import { StyleSheet, Text } from "react-native";
import OnboardingLayout from "./OnboardingLayout";

export default function DataUseScreen({ navigation }) {
  return (
    <OnboardingLayout
      title="How we use your information"
      onBack={() => navigation.goBack()}
      onNext={() => navigation.replace("MainTabs")}
    >
        <Text style={styles.text}>
          We use your answers to calculate a model-based reference score and compare
          it with AD and non-AD reference populations.
        </Text>

        <Text style={styles.text}>
          The current version of this app does not store assessment responses or
          model results in a user database. Your information is used to generate the
          score during the prediction request.
        </Text>

        <Text style={styles.text}>
          We do not sell your information. We do not share your assessment
          information with third parties for advertising or marketing.
        </Text>

        <Text style={styles.note}>
          If future versions add optional data storage or research use, we will
          update the Privacy Policy before releasing that feature.
        </Text>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  text: { fontSize: 19, lineHeight: 29, color: "#1f2937", marginBottom: 16 },
  note: { fontSize: 16, lineHeight: 24, color: "#64748b", marginTop: 8 }
});
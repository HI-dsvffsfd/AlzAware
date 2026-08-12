import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About This Tool</Text>

        <Text style={styles.text}>
          AlzAware estimates a model-based reference score using questionnaire
          information and self-reported medical history.
        </Text>

        <Text style={styles.text}>
          The score is compared with scores from people with Alzheimer's disease
          (AD) and people without AD in a reference dataset.
        </Text>

        <Text style={styles.warning}>
          AlzAware is not a medical device and does not diagnose, treat, cure, or
          prevent any medical condition. For medical advice, diagnosis, or treatment,
          please consult a qualified healthcare professional.
        </Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 18,
      paddingTop: 14,
      paddingBottom: 20,
      backgroundColor: "#f5f7fb"
    },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: "#334155",
    marginBottom: 14
  },
  warning: {
    fontSize: 15,
    lineHeight: 22,
    color: "#991b1b",
    marginTop: 8
  }
});
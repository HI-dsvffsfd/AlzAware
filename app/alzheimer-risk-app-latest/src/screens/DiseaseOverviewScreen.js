import React from "react";
import { StyleSheet, Text } from "react-native";
import OnboardingLayout from "./OnboardingLayout";

export default function DiseaseOverviewScreen({ navigation }) {
  return (
    <OnboardingLayout
      title="Why early cognitive risk awareness matters"
      onBack={() => navigation.goBack()}
      onNext={() => navigation.navigate("DataUse")}
    >
        <Text style={styles.text}>
          Dementia affects tens of millions of people worldwide, and Alzheimer's
          disease is the most common form of dementia.
        </Text>

        <Text style={styles.text}>
          According to the World Health Organization, about 57 million people were
          living with dementia worldwide in 2021, with nearly 10 million new cases
          each year.
        </Text>

        <Text style={styles.text}>
          In the United States, the Alzheimer's Association estimates that more than
          7 million Americans are living with Alzheimer's disease.
        </Text>

        <Text style={styles.text}>
          Many people also manage other health conditions, including sleep problems,
          depression, anxiety, cardiovascular disease, diabetes, or stroke history.
          These factors can make early risk awareness and timely medical follow-up
          especially important.
        </Text>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  text: { fontSize: 19, lineHeight: 29, color: "#1f2937", marginBottom: 16 }
});
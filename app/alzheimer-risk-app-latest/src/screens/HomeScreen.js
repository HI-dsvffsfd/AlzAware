import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const PRIMARY = "#0f766e";

export default function HomeScreen({ navigation }) {
  const goToAssessment = () => {
    navigation.getParent()?.navigate("Assess", {
      screen: "Disclaimer"
    });
  };

  const goToLearn = () => {
    navigation.getParent()?.navigate("Learn", {
      screen: "About"
    });
  };

  return (
    <View style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.appName}>AlzAware</Text>

        <Text style={styles.title}>Your Alzheimer Risk Reference</Text>

        <Text style={styles.note}>
          This app provides a reference score based on a machine learning model.
          It compares your score with AD and non-AD reference populations. It is
          not a medical diagnosis.
        </Text>

        <Pressable
          style={[styles.button, styles.primaryButton]}
          onPress={goToAssessment}
        >
          <Text style={styles.primaryButtonText}>Start Assessment</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.secondaryButton]}
          onPress={goToLearn}
        >
          <Text style={styles.secondaryButtonText}>About This Tool</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f6faf9"
  },
    container: {
      flex: 1,
      paddingHorizontal: 22,
      paddingTop: 22,
      paddingBottom: 22,
      backgroundColor: "#f6faf9",
      justifyContent: "center"
    },
  appName: {
    fontSize: 18,
    fontWeight: "800",
    color: PRIMARY,
    marginBottom: 8,
    textAlign: "center"
  },
  title: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "800",
    color: "#102a43",
    marginBottom: 14,
    textAlign: "center"
  },
  note: {
    fontSize: 16,
    lineHeight: 24,
    color: "#475569",
    marginBottom: 24,
    textAlign: "center"
  },
  button: {
    minHeight: 58,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12
  },
  primaryButton: {
    backgroundColor: PRIMARY
  },
  secondaryButton: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: PRIMARY
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800"
  },
  secondaryButtonText: {
    color: PRIMARY,
    fontSize: 18,
    fontWeight: "800"
  }
});
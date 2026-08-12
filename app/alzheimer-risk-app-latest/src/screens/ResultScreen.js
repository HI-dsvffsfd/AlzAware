import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const PURPLE = "#0f766e";

export default function ResultScreen({ navigation, route }) {
  const { result } = route.params;
  const adPercent = Number(result.ad_lower_or_equal_percent);
  const showTrainingPrompt = adPercent >= 30;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.box}>
        <Text style={styles.title}>
          Higher score means more model-estimated risk of AD.
        </Text>

        <Text style={styles.text}>
          Compared with the reference dataset, your score is higher than{" "}
          <Text style={styles.bold}>{result.ad_lower_or_equal_percent}%</Text>
          {" "}of the <Text style={styles.bold}>AD</Text> population and{" "}
          <Text style={styles.bold}>{result.non_ad_lower_or_equal_percent}%</Text>
          {" "}of the <Text style={styles.bold}>non-AD</Text> population.
        </Text>

        <Text style={styles.note}>
          This result is for reference only and is not a medical diagnosis.
        </Text>
      </View>

      <Pressable
        style={[styles.button, styles.next]}
        onPress={() => navigation.replace("Assessment", { resetForm: Date.now() })}
      >
        <Text style={styles.nextText}>Start New Assessment</Text>
      </Pressable>

      <Pressable
        style={[styles.button, styles.back]}
        onPress={() =>
          navigation.getParent()?.navigate("Home", {
            screen: "HomeMain"
          })
        }
      >
        <Text style={styles.backText}>Back to Home</Text>
      </Pressable>

      {showTrainingPrompt ? (
        <View style={styles.trainingBox}>
          <Text style={styles.trainingTitle}>Try a Short Brain Exercise Activity?</Text>
          <Text style={styles.trainingText}>
            You can try a brief cognitive exercise for engagement and practice. These
            activities do not diagnose, treat, or prevent any medical condition.
          </Text>

          <Pressable
            style={[styles.button, styles.next]}
            onPress={() =>
              navigation.getParent()?.navigate("Training", {
                screen: "TrainingMain",
                params: { resetTraining: Date.now() }
              })
            }
          >
            <Text style={styles.nextText}>Start Brain Training</Text>
          </Pressable>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f7fb"
  },
  container: {
    padding: 18,
    paddingBottom: 34,
    backgroundColor: "#f5f7fb"
  },
  box: {
    backgroundColor: "#ecfdf5",
    borderColor: "#bbf7d0",
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#14532d",
    marginBottom: 12
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: "#14532d",
    marginBottom: 12
  },
  bold: {
    fontWeight: "800",
    color: "#14532d"
  },
  note: {
    fontSize: 14,
    lineHeight: 21,
    color: "#166534",
    marginTop: 8
  },
  button: {
    minHeight: 58,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12
  },
  next: {
    backgroundColor: PURPLE
  },
  back: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: PURPLE
  },
  nextText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800"
  },
  backText: {
    color: PURPLE,
    fontSize: 18,
    fontWeight: "800"
  },
  trainingBox: {
    backgroundColor: "#ffffff",
    borderColor: "#dbe7e5",
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginTop: 4,
    marginBottom: 16
  },
  trainingTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8
  },
  trainingText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#475569",
    marginBottom: 14
  }
});
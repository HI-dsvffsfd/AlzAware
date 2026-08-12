import React, { useCallback, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const PURPLE = "#0f766e";

export default function DisclaimerScreen({ navigation }) {
  const [agreed, setAgreed] = useState(false);
  const scrollRef = useRef(null);

    useFocusEffect(
      useCallback(() => {
        return () => {
          setAgreed(false);

          requestAnimationFrame(() => {
            scrollRef.current?.scrollTo({ y: 0, animated: false });
          });
        };
      }, [])
    );

  return (
    <View style={styles.safe}>
      <ScrollView
        ref={scrollRef}
        style={styles.screen}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
          <Text style={styles.title}>Before You Start</Text>

          <View style={styles.card}>
            <Text style={styles.paragraph}>
              This assessment sends your answers to our prediction service to calculate
              a model-based reference score. It is intended for educational and
              risk-awareness purposes only.
            </Text>

            <Text style={styles.paragraph}>
              AlzAware is not a medical device and does not diagnose, treat, cure, or
              prevent Alzheimer's disease or any other medical condition. It should not
              replace evaluation by a qualified healthcare professional.
            </Text>

            <Text style={styles.paragraph}>
              Your score is compared with scores from Alzheimer's disease (AD) and
              non-AD reference populations. Higher score means higher model-estimated
              risk.
            </Text>

            <Text style={styles.paragraph}>
              Please do not enter personal identifying information such as your full
              name, address, phone number, or medical record number.
            </Text>

            <Pressable onPress={() => navigation.navigate("PrivacyPolicy")}>
              <Text style={styles.link}>Read Privacy Policy</Text>
            </Pressable>
          </View>

          <Pressable style={styles.checkRow} onPress={() => setAgreed(!agreed)}>
            <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
              {agreed ? <Text style={styles.checkMark}>✓</Text> : null}
            </View>

            <Text style={styles.checkText}>
              I have read and understand the information above. I understand that this
              tool is for reference only and is not medical advice, diagnosis, or
              treatment. If I have health concerns, I should consult a qualified
              healthcare professional.
            </Text>
          </Pressable>

          <View style={styles.actions}>
            <Pressable style={[styles.button, styles.back]} onPress={() => navigation.goBack()}>
              <Text style={styles.backText}>Back</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.next, !agreed && styles.buttonDisabled]}
              disabled={!agreed}
              onPress={() => navigation.navigate("Assessment")}
            >
              <Text style={styles.nextText}>I Agree</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f7fb" },
  screen: { flex: 1, backgroundColor: "#f5f7fb" },
  container: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 20
  },
  title: { fontSize: 28, fontWeight: "800", color: "#111827", marginBottom: 16 },
  card: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16
  },
  paragraph: { fontSize: 15, lineHeight: 23, color: "#334155", marginBottom: 12 },
  link: { fontSize: 15, fontWeight: "800", color: PURPLE, textDecorationLine: "underline" },
  checkRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    padding: 14,
    marginBottom: 18
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: "#94a3b8",
    borderRadius: 4,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  checkboxChecked: { backgroundColor: PURPLE, borderColor: PURPLE },
  checkMark: { color: "#ffffff", fontSize: 15, fontWeight: "800" },
  checkText: { flex: 1, fontSize: 14, lineHeight: 21, color: "#334155" },
  actions: { flexDirection: "row", gap: 14 },
  button: {
    flex: 1,
    minHeight: 58,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center"
  },
  back: { backgroundColor: "#ffffff", borderWidth: 2, borderColor: PURPLE },
  next: { backgroundColor: PURPLE },
  buttonDisabled: { backgroundColor: "#94a3b8" },
  backText: { color: PURPLE, fontSize: 18, fontWeight: "800" },
  nextText: { color: "#ffffff", fontSize: 18, fontWeight: "800" }
});
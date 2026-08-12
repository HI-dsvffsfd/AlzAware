import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function OnboardingLayout({
  title,
  children,
  onBack,
  onNext,
  nextLabel = "Continue"
}) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <LinearGradient colors={["#0f766e", "#38bdf8"]} style={styles.bar} />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>{title}</Text>
          {children}
        </ScrollView>

        <View style={[styles.buttons, { paddingBottom: insets.bottom + 14 }]}>
          {onBack ? (
            <Pressable style={[styles.button, styles.back]} onPress={onBack}>
              <Text style={styles.backText}>Back</Text>
            </Pressable>
          ) : (
            <View style={styles.empty} />
          )}

          <Pressable style={[styles.button, styles.next]} onPress={onNext}>
            <Text style={styles.nextText}>{nextLabel}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  bar: {
    height: 14
  },
  scroll: {
    flex: 1
  },
  content: {
    paddingHorizontal: 28,
    paddingTop: 54,
    paddingBottom: 32
  },
  title: {
    fontSize: 34,
    lineHeight: 42,
    fontWeight: "800",
    color: "#130018",
    marginBottom: 26
  },
  buttons: {
    flexDirection: "row",
    gap: 14,
    paddingHorizontal: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    backgroundColor: "#ffffff"
  },
  button: {
    flex: 1,
    minHeight: 58,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center"
  },
  back: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#0f766e"
  },
  next: {
    backgroundColor: "#0f766e"
  },
  backText: {
    color: "#0f766e",
    fontSize: 18,
    fontWeight: "800"
  },
  nextText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800"
  },
  empty: {
    flex: 1
  }
});
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function SettingsScreen({ navigation }) {
  return (
    <View style={styles.safe}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Settings</Text>

        <Text style={styles.note}>
          Manage app information, privacy, and reference materials.
        </Text>

        <Pressable
          style={styles.row}
          onPress={() => navigation.navigate("About")}
        >
          <Text style={styles.rowTitle}>About This Tool</Text>
          <Text style={styles.rowSubtitle}>
            Learn what this app does and does not do.
          </Text>
        </Pressable>

        <Pressable
          style={styles.row}
          onPress={() => navigation.navigate("PrivacyPolicy")}
        >
          <Text style={styles.rowTitle}>Privacy Policy</Text>
          <Text style={styles.rowSubtitle}>
            Review how assessment information may be used.
          </Text>
        </Pressable>

        <Pressable
          style={styles.row}
          onPress={() => navigation.navigate("Disclaimer")}
        >
          <Text style={styles.rowTitle}>Disclaimer</Text>
          <Text style={styles.rowSubtitle}>
            Review the reference-only medical disclaimer.
          </Text>
        </Pressable>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Model version</Text>
          <Text style={styles.infoValue}>XGBoost reference model v1.0</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>App version</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f5f7fb"
  },
  screen: {
    flex: 1,
    backgroundColor: "#f5f7fb"
  },
    container: {
      paddingHorizontal: 18,
      paddingTop: 14,
      paddingBottom: 20,
      backgroundColor: "#f5f7fb"
    },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8
  },
  note: {
    fontSize: 15,
    lineHeight: 22,
    color: "#64748b",
    marginBottom: 18
  },
  row: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4
  },
  rowSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#64748b"
  },
  infoBox: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12
  },
  infoLabel: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 4
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#334155"
  }
});
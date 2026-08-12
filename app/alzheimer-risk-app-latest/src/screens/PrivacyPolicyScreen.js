import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function PrivacyPolicyScreen() {
  return (
    <View style={styles.safe}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Privacy Policy</Text>

        <Text style={styles.updated}>Effective Date: August 10, 2026</Text>

        <Section title="Overview">
          <Text style={styles.text}>
            AlzAware is a cognitive risk reference tool designed for educational
            and risk-awareness purposes. This Privacy Policy explains how
            AlzAware processes information when you use the website or
            assessment tool.
          </Text>

          <Text style={styles.text}>
            AlzAware is not a medical device and does not provide medical
            diagnosis, medical advice, treatment recommendations, or emergency
            services. If you have concerns about memory, cognition, or health,
            please consult a qualified healthcare professional.
          </Text>
        </Section>

        <Section title="Information We Process">
          <Text style={styles.text}>
            When you complete the assessment, AlzAware processes the information
            you choose to enter, including age, sex, race, Hispanic or Latino
            status, handedness, education level, number of daily medications,
            self-reported medical history, and model-generated reference score
            results.
          </Text>

          <Text style={styles.text}>
            Please do not enter personal identifying information such as your
            full name, home address, phone number, medical record number,
            insurance information, or other direct identifiers.
          </Text>
        </Section>

        <Section title="How We Use Information">
          <Text style={styles.text}>
            Your assessment information is sent to our prediction service only
            to calculate a model-based reference score and return the result to
            you.
          </Text>

          <Text style={styles.text}>
            The current version of AlzAware does not store assessment responses
            or model results in a user database. In short, we process your
            assessment information to calculate your score, but we do not
            currently store your assessment responses or model results in a
            database.
          </Text>
        </Section>

        <Section title="Data Sharing">
          <Text style={styles.text}>
            We do not sell your information. We do not share your assessment
            information with third parties for advertising or marketing.
          </Text>

          <Text style={styles.text}>
            We may disclose information only if required by law, regulation,
            legal process, or public safety obligations.
          </Text>
        </Section>

        <Section title="Data Storage">
          <Text style={styles.text}>
            The current version of AlzAware does not save assessment responses
            or model results to a user database. Assessment information is used
            to generate the score during the prediction request.
          </Text>

          <Text style={styles.text}>
            If future versions add optional data storage, research storage,
            analytics, or model improvement features, this Privacy Policy will
            be updated before those features are released.
          </Text>
        </Section>

        <Section title="Cloud Hosting and Security">
          <Text style={styles.text}>
            AlzAware uses a cloud-hosted prediction service to calculate
            assessment results. Information submitted through the assessment is
            transmitted to the prediction service over HTTPS. The cloud hosting
            provider may process limited technical request information as
            necessary to provide hosting, security, and service operations.
          </Text>

          <Text style={styles.text}>
            We use reasonable technical and organizational safeguards to protect
            information. However, no method of electronic transmission or
            processing can be guaranteed to be completely secure.
          </Text>
        </Section>

        <Section title="Cookies and Website Analytics">
          <Text style={styles.text}>
            The AlzAware website may use basic cookies or technical tools
            provided by the website platform to operate the site, improve
            reliability, and support standard website functions. AlzAware does
            not use assessment information for advertising.
          </Text>
        </Section>

        <Section title="Children's Privacy">
          <Text style={styles.text}>
            AlzAware is intended for users who are 18 years of age or older. We
            do not knowingly collect or process assessment information from
            children or users under 18.
          </Text>
        </Section>

        <Section title="Changes to This Privacy Policy">
          <Text style={styles.text}>
            We may update this Privacy Policy from time to time. When changes
            are made, we will update the effective date above.
          </Text>
        </Section>

        <Section title="Contact Us">
          <Text style={styles.contact}>alzaware.info@gmail.com</Text>
        </Section>
      </ScrollView>
    </View>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
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
    paddingBottom: 24
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6
  },
  updated: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 18
  },
  section: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8
  },
  text: {
    fontSize: 15,
    lineHeight: 23,
    color: "#334155",
    marginBottom: 10
  },
  contact: {
    fontSize: 15,
    lineHeight: 23,
    color: "#0f766e",
    fontWeight: "800"
  }
});
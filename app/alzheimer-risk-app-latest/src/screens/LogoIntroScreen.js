import React, { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LogoIntroScreen({ navigation }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true
      })
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace("IntroAbout");
    }, 1600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.Image
        source={require("../../assets/icon.png")}
        style={[styles.logo, { opacity, transform: [{ scale }] }]}
      />

      <Text style={styles.title}>AlzAware</Text>
      <Text style={styles.subtitle}>Your Alzheimer Risk Reference</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f6faf9"
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 18
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#0f766e",
    marginBottom: 6
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#64748b"
  }
});
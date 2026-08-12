import React from "react";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";

import LogoIntroScreen from "./src/screens/LogoIntroScreen";
import IntroAboutScreen from "./src/screens/IntroAboutScreen";
import DiseaseOverviewScreen from "./src/screens/DiseaseOverviewScreen";
import DataUseScreen from "./src/screens/DataUseScreen";

import HomeScreen from "./src/screens/HomeScreen";
import AssessmentScreen from "./src/screens/AssessmentScreen";
import ResultScreen from "./src/screens/ResultScreen";
import AboutScreen from "./src/screens/AboutScreen";
import DisclaimerScreen from "./src/screens/DisclaimerScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import PrivacyPolicyScreen from "./src/screens/PrivacyPolicyScreen";
import TrainingScreen from "./src/screens/TrainingScreen";

const RootStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const AssessStack = createNativeStackNavigator();
const LearnStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const TrainingStack = createNativeStackNavigator();

const PRIMARY = "#0f766e";

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ title: "AlzAware" }}
      />
    </HomeStack.Navigator>
  );
}

function AssessStackScreen() {
  return (
    <AssessStack.Navigator>
      <AssessStack.Screen
        name="Disclaimer"
        component={DisclaimerScreen}
        options={{ title: "Before You Start" }}
      />

      <AssessStack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{ title: "Privacy Policy" }}
      />

      <AssessStack.Screen
        name="Assessment"
        component={AssessmentScreen}
        options={{ title: "Assessment" }}
      />

      <AssessStack.Screen
        name="Result"
        component={ResultScreen}
        options={{ title: "Result" }}
      />
    </AssessStack.Navigator>
  );
}

function LearnStackScreen() {
  return (
    <LearnStack.Navigator>
      <LearnStack.Screen
        name="About"
        component={AboutScreen}
        options={{ title: "About" }}
      />
      <LearnStack.Screen
        name="DiseaseOverview"
        component={DiseaseOverviewScreen}
        options={{ title: "Disease Overview" }}
      />
    </LearnStack.Navigator>
  );
}

function TrainingStackScreen() {
  return (
    <TrainingStack.Navigator>
      <TrainingStack.Screen
        name="TrainingMain"
        component={TrainingScreen}
        options={{ title: "Brain Training" }}
      />
    </TrainingStack.Navigator>
  );
}

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name="SettingsMain"
        component={SettingsScreen}
        options={{ title: "Settings" }}
      />
      <SettingsStack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{ title: "Privacy Policy" }}
      />
      <SettingsStack.Screen
        name="Disclaimer"
        component={DisclaimerScreen}
        options={{ title: "Disclaimer" }}
      />
      <SettingsStack.Screen
        name="About"
        component={AboutScreen}
        options={{ title: "About" }}
      />
    </SettingsStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: PRIMARY,
        tabBarInactiveTintColor: "#64748b",
        tabBarStyle: {
          minHeight: 64,
          paddingTop: 6,
          paddingBottom: 8
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700"
        }
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>⌂</Text>
        }}
      />

      <Tab.Screen
        name="Assess"
        component={AssessStackScreen}
        options={{
          tabBarLabel: "Assess",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>✓</Text>
        }}
      />

        <Tab.Screen
          name="Training"
          component={TrainingStackScreen}
          listeners={({ navigation }) => ({
            tabPress: (event) => {
              event.preventDefault();

              navigation.navigate("Training", {
                screen: "TrainingMain",
                params: { requestTrainingReset: Date.now() }
              });
            }
          })}
          options={{
            tabBarLabel: "Exercise",
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>◇</Text>
          }}
        />

      <Tab.Screen
        name="Learn"
        component={LearnStackScreen}
        options={{
          tabBarLabel: "About",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>i</Text>
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsStackScreen}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>⚙</Text>
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStack.Navigator initialRouteName="LogoIntro">
          <RootStack.Screen
            name="LogoIntro"
            component={LogoIntroScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="IntroAbout"
            component={IntroAboutScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="DiseaseOverview"
            component={DiseaseOverviewScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="DataUse"
            component={DataUseScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
} from "react-native";
import * as Animatable from "react-native-animatable";
import COLORS from "../consts/colors";

export default function AboutUs({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroText}>TTR</Text>
        <Text style={styles.heroText}>Center.</Text>
      </View>
      <Animatable.View animation="fadeInUp" style={styles.main}>
        <Text style={styles.prompt}>
          Enjoy the experience of better fitness tips...
        </Text>
      </Animatable.View>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.mainColor,
  },
  hero: {
    flex: 6,
    marginLeft: 25,
    justifyContent: "center",
  },
  heroText: {
    color: COLORS.lightBlack,
    fontSize: 50,
    fontWeight: "bold",
    marginBottom: -8,
  },
  main: {
    flex: 4,
    justifyContent: "space-between",
    backgroundColor: COLORS.lightBlack,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    elevation: 10,
    shadowOffset: { width: 0, height: -1 },
    padding: 25,
  },
  prompt: {
    color: "#666",
    fontSize: 16,
    marginTop: 12,
  },
  buttonContainer: {
    alignItems: "center",
  },
  login: {
    width: "100%",
    backgroundColor: COLORS.mainColor,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 30,
    elevation: 2,
  },
  loginText: {
    color: COLORS.lightBlack,
    fontSize: 20,
  },
  signupContainer: {
    marginVertical: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  signup: {
    fontSize: 15,
    color: "#666",
  },
  signupLink: {
    color: COLORS.mainColor,
    fontSize: 15,
  },
});

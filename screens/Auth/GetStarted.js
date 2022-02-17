import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  ImageBackground,
} from "react-native";
import * as Animatable from "react-native-animatable";
import COLORS from "../../consts/colors";

export default function GetStarted({ navigation }) {
  const image = require("../../assets/bg.jpg");
  return (
    <View style={styles.container}>
      <ImageBackground source={image} resizeMode="cover" style={styles.hero}>
        <Text style={styles.heroText}>TTR</Text>
        <Animatable.View animation="fadeInUp" style={styles.main}>
          <View style={styles.buttonContainer}>
            <TouchableNativeFeedback
              onPress={() => navigation.navigate("SignIn")}
            >
              <View style={styles.login}>
                <Text style={styles.loginText}>Sign In</Text>
              </View>
            </TouchableNativeFeedback>
            <View style={styles.signupContainer}>
              <Text style={styles.signup}>Does not have an account? </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate("SignUp")}
              >
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animatable.View>
        <StatusBar style="light" />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    flex: 6,
    justifyContent: "center",
  },
  heroText: {
    color: COLORS.mainColor,
    fontSize: 140,
    textAlign: "center",
    marginTop: 243,
    fontFamily: "Roboto",
    fontStyle: "italic",
    fontWeight: "bold",
  },
  main: {
    flex: 4,
    justifyContent: "flex-end",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
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

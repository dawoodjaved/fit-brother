import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  TextInput,
} from "react-native";
import * as Animatable from "react-native-animatable";
import signInAction from "../../Redux/actions/signInActions";
import COLORS from "../../consts/colors";
import { useDispatch, useSelector } from "react-redux";
import clearAction from "../../Redux/actions/clearAction";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const { authError } = useSelector((state) => state.auth);

  const SignInActionAsProps = (userObject) => {
    dispatch(signInAction(userObject));
  };
  const clearActionAsProps = () => {
    dispatch(clearAction());
  };

  const onSignIn = () => {
    const cred = {
      email,
      password,
    };
    clearActionAsProps();
    SignInActionAsProps(cred);
  };

  const toSignUp = () => {
    clearActionAsProps();
    navigation.navigate("SignUp");
  };
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroText}>Welcome!</Text>
      </View>
      <Animatable.View animation="fadeInUp" style={styles.main}>
        <View>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666"
            autoCapitalize="none"
            onChangeText={(email) => setEmail(email)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
          {authError && <Text style={styles.error}>{authError}</Text>}
          <View style={styles.forgotPasswordContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text style={styles.forgotPasswordLink}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableNativeFeedback onPress={onSignIn}>
            <View style={styles.login}>
              <Text style={styles.loginText}>Sign In</Text>
            </View>
          </TouchableNativeFeedback>
          <View style={styles.signupContainer}>
            <Text style={styles.signup}>Does not have an account? </Text>
            <TouchableOpacity activeOpacity={0.8} onPress={toSignUp}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animatable.View>
      <StatusBar style="light" />
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.mainColor,
  },
  hero: {
    flex: 3,
    marginLeft: 25,
    justifyContent: "flex-end",
    marginBottom: 30,
  },
  heroText: {
    color: "lightBlack",
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: -8,
  },
  main: {
    flex: 6,
    justifyContent: "space-between",
    backgroundColor: COLORS.lightBlack,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    elevation: 10,
    shadowOffset: { width: 0, height: -1 },
    paddingHorizontal: 25,
    paddingVertical: 40,
  },
  error: {
    fontSize: 15,
    color: "red",
  },
  input: {
    borderWidth: 2,
    borderColor: COLORS.mainColor,
    borderRadius: 25,
    marginBottom: 15,
    paddingVertical: 7,
    paddingHorizontal: 20,
    fontSize: 16,
    color: COLORS.mainColor,
  },
  buttonContainer: {
    alignItems: "center",
    marginVertical: 20,
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
    color: "lightBlack",
    fontSize: 20,
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginRight: 10,
  },
  forgotPasswordLink: {
    color: COLORS.mainColor,
    fontSize: 15,
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

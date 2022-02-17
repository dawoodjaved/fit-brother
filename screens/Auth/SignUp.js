import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  TextInput,
} from "react-native";
import * as Animatable from "react-native-animatable";
import signUpAction from "../../Redux/actions/signUpAction";
import COLORS from "../../consts/colors";
import { useSelector, useDispatch } from "react-redux";
import clearAction from "../../Redux/actions/clearAction";
import RNPickerSelect from "react-native-picker-select";

const SignUp = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");

  const genderTypes = [
    { label: "Male", value: "male" },
    { label: "FeMale", value: "female" },
    { label: "Other", value: "other" },
  ];

  const dispatch = useDispatch();
  const { authError } = useSelector((state) => state.auth);
  const SignUpActionAsProps = (userObject) => {
    dispatch(signUpAction(userObject));
  };
  const clearActionAsProps = () => {
    dispatch(clearAction());
  };
  const onSignUp = () => {
    const cred = {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      gender,
    };
    clearActionAsProps();
    SignUpActionAsProps(cred);
  };

  const toSignIn = () => {
    clearActionAsProps();
    navigation.navigate("SignIn");
  };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroText}>Join Us!</Text>
      </View>
      <Animatable.View animation="fadeInUp" style={styles.main}>
        <View>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="#666"
            autoCapitalize="none"
            onChangeText={(firstName) => setFirstName(firstName)}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#666"
            autoCapitalize="none"
            onChangeText={(lastName) => setLastName(lastName)}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#666"
            autoCapitalize="none"
            onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
          />
          <TextInput
            style={styles.input}
            placeholder="Gender"
            placeholderTextColor="#666"
            autoCapitalize="none"
            onChangeText={(gender) => setGender(gender)}
          />
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
        </View>
        {authError && <Text style={styles.error}>{authError}</Text>}
        <View style={styles.buttonContainer}>
          <TouchableNativeFeedback onPress={onSignUp}>
            <View style={styles.signup}>
              <Text style={styles.signupText}>Sign Up</Text>
            </View>
          </TouchableNativeFeedback>
          <View style={styles.loginContainer}>
            <Text style={styles.login}>Already have an account? </Text>
            <TouchableOpacity activeOpacity={0.8} onPress={toSignIn}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animatable.View>
      <StatusBar style="light" />
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container2: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.mainColor,
  },
  hero: {
    flex: 2,
    marginLeft: 25,
    justifyContent: "flex-end",
    marginBottom: 30,
  },
  heroText: {
    color: COLORS.lightBlack,
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
  pickerInput: {
    border: "1px solid",
    borderColor: "mainColorF",
  },
  buttonContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  signup: {
    width: "100%",
    backgroundColor: COLORS.mainColor,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 30,
    elevation: 2,
  },
  signupText: {
    color: COLORS.lightBlack,
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
  loginContainer: {
    marginVertical: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  login: {
    fontSize: 15,
    color: "#666",
  },
  error: {
    fontSize: 15,
    color: "red",
  },
  loginLink: {
    color: COLORS.mainColor,
    fontSize: 15,
  },
});

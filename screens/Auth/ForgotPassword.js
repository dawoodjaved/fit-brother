import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableNativeFeedback,
} from "react-native";
import * as Animatable from "react-native-animatable";
import COLORS from "../../consts/colors";
import ResetPasswordAction from "../../Redux/actions/ResetPasswordAction";
import { useDispatch, useSelector } from "react-redux";

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();
  const { authError } = useSelector((state) => state.auth);

  const ResetPasswordActionAsProps = (userObject) => {
    dispatch(ResetPasswordAction(userObject));
  };

  const onResetPass = () => {
    ResetPasswordActionAsProps(email);
    if (!authError) {
      navigation.navigate("Home");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroText}>Tell us</Text>
        <Text style={styles.heroText}>your email.</Text>
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
        </View>
        <View style={styles.buttonContainer}>
          <TouchableNativeFeedback
            onPress={() => navigation.navigate("SignIn")}
          >
            <View style={styles.sendLink}>
              <Text style={styles.sendLinkText} onPress={onResetPass}>
                Send Link
              </Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </Animatable.View>
      <StatusBar style="light" />
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.mainColor,
  },
  hero: {
    flex: 2,
    marginLeft: 25,
    marginTop: 30,
    marginBottom: 15,
    justifyContent: "center",
  },
  heroText: {
    color: COLORS.lightBlack,
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: -8,
  },
  main: {
    flex: 4,
    backgroundColor: COLORS.lightBlack,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    elevation: 10,
    shadowOffset: { width: 0, height: -1 },
    padding: 25,
  },
  input: {
    borderWidth: 2,
    borderColor: COLORS.mainColor,
    borderRadius: 25,
    marginTop: 50,
    marginBottom: 40,
    paddingVertical: 7,
    paddingHorizontal: 20,
    fontSize: 16,
    color: COLORS.mainColor,
  },
  buttonContainer: {
    alignItems: "center",
  },
  sendLink: {
    width: "100%",
    backgroundColor: COLORS.mainColor,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 30,
    elevation: 2,
  },
  sendLinkText: {
    color: COLORS.lightBlack,
    fontSize: 20,
  },
});

import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback } from "react-native";
import * as Animatable from "react-native-animatable";
import fetchUser from "../Redux/actions/fetchUserAction";
import clearAction from "../Redux/actions/clearAction";
import { connect } from "react-redux";

const InputType = ({ navigation, fetchUserAsProps, clearActionAsProps }) => {
  const toCamera = () => {
    navigation.navigate("create");
  };

  const toText = () => {
    navigation.navigate("textinput");
  };

  useEffect(() => {
    fetchUserAsProps();
  }, []);

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeIn" style={styles.hero}>
        <Text style={styles.heroText}>1. Choose Input</Text>
        <Text style={styles.heroTextDown}>Method</Text>
      </Animatable.View>
      <Animatable.View animation="fadeInDown" style={styles.buttonContainer}>
        <TouchableNativeFeedback onPress={toCamera}>
          <View style={styles.cameraButton}>
            <Text style={styles.cameraButtonText}>Camera</Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback onPress={toText}>
          <View style={styles.textButton}>
            <Text style={styles.textButtonText}>Text</Text>
          </View>
        </TouchableNativeFeedback>
      </Animatable.View>
      <StatusBar style="dark" />
    </View>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUserAsProps: () => {
      dispatch(fetchUser());
    },
    clearActionAsProps: () => {
      dispatch(clearAction());
    },
  };
};

export default connect(null, mapDispatchToProps)(InputType);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  hero: {
    marginLeft: 25,
    marginTop: 40,
  },
  heroText: {
    color: "grey",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: -5,
  },
  heroTextDown: {
    marginLeft: 34,
    color: "grey",
    fontSize: 30,
    fontWeight: "bold",
  },
  buttonContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: 180,
  },
  cameraButton: {
    width: "70%",
    marginBottom: 20,
    backgroundColor: "#0984e3",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 30,
    elevation: 2,
  },
  textButton: {
    width: "70%",
    backgroundColor: "#fafafa",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 30,
    elevation: 2,
  },
  cameraButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  textButtonText: {
    color: "#9e9e9e",
    fontSize: 20,
    fontWeight: "bold",
  },
});

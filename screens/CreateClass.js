import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback,
  TextInput,
} from "react-native";
import createClassAction from "./../Redux/actions/createClassAction";
import { useSelector, useDispatch } from "react-redux";

import clearAction from "./../Redux/actions/clearAction";
import { TimePickerModal } from "react-native-paper-dates";
import "intl";
import "intl/locale-data/jsonp/en";
import COLORS from "../consts/colors";

const CreateClass = ({ navigation }) => {
  const [visible, setVisible] = React.useState(false);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");

  const onDismiss = React.useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const onConfirm = React.useCallback(
    ({ hours, minutes }) => {
      setVisible(false);
      const exactTime = `${hours}:${minutes}`;
      setTime(exactTime);
    },
    [setVisible]
  );

  const dispatch = useDispatch();
  const { classError } = useSelector((state) => state.class);

  const createClassActionAsProps = (userObject) => {
    dispatch(createClassAction(userObject));
  };

  const onCreateClass = () => {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    const fullDate = `${date}-${month}-${year}`;

    const cred = {
      title,
      time,
      fullDate,
    };

    createClassActionAsProps(cred);
    navigation.navigate("userlist");
  };

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <TextInput
          style={styles.input}
          placeholder="Class Title"
          placeholderTextColor="#666"
          autoCapitalize="none"
          onChangeText={(title) => setTitle(title)}
        />

        <TextInput
          style={styles.input}
          placeholder="Class Time"
          placeholderTextColor="#666"
          autoCapitalize="none"
          value={time}
          onPressIn={() => setVisible(true)}
        />

        <TimePickerModal
          visible={visible}
          onDismiss={onDismiss}
          onConfirm={onConfirm}
          hours={12} // default: current hours
          minutes={14} // default: current minutes
          label="Select time" // optional, default 'Select time'
          cancelLabel="Cancel" // optional, default: 'Cancel'
          confirmLabel="Ok" // optional, default: 'Ok'
          animationType="fade" // optional, default is 'none'
          locale={"en"} // optional, default is automically detected by your system
        />

        {classError && <Text style={styles.error}>{classError}</Text>}

        <TouchableNativeFeedback onPress={onCreateClass}>
          <View style={styles.signup}>
            <Text style={styles.signupText}>Create Class</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
      <StatusBar style="light" />
    </View>
  );
};

export default CreateClass;

const styles = StyleSheet.create({
  container: {
    flex: 3,
    backgroundColor: COLORS.lightBlack,
  },

  main: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: COLORS.lightBlack,
    elevation: 10,
    shadowOffset: { width: 0, height: -1 },
    paddingHorizontal: 25,
    paddingVertical: 170,
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
  detailInput: {
    borderWidth: 2,
    borderColor: COLORS.mainColor,
    borderRadius: 25,
    marginBottom: 15,
    paddingVertical: 50,
    paddingHorizontal: 20,
    fontSize: 16,
    color: COLORS.mainColor,
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

  error: {
    fontSize: 15,
    color: "red",
  },
});

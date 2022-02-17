import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import UsersList from "../screens/UsersList";
import CreateClass from "./../screens/CreateClass";
import Profile from "./../screens/Profile";
import MainScreen from "../screens/MainScreen";
import MyBookings from "../screens/MyBookings";
import { useSelector } from "react-redux";
import TodayBookings from "./../screens/TodayBookings";

const Stack = createStackNavigator();
const HomeStack = () => {
  const adminEmail = "admin@gmail.com";

  const { currentUser: user } = useSelector((state) => state.auth);

  return (
    <Stack.Navigator initialRouteName="start">
      <Stack.Screen
        name="start"
        component={MainScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="userlist"
        component={UsersList}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="mybookings"
        component={MyBookings}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: "#e7305b",
          },
        }}
      />
      <Stack.Screen
        name="create"
        component={CreateClass}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: "#e7305b",
          },
        }}
      />
      <Stack.Screen
        name="history"
        component={TodayBookings}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: "#e7305b",
          },
        }}
      />
      <Stack.Screen
        name="AboutUs"
        component={MainScreen}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: "#e7305b",
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;

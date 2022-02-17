import React from "react";

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

import Icon from "react-native-vector-icons/Ionicons";

import Profile from "./../screens/Profile";
import HomeStack from "../routes/HomeStack";
import MyBookings from "./MyBookings";
import AboutUs from "./AboutUs";

const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = () => {
  return (
    <Tab.Navigator initialRouteName="Home" activeColor="#fff">
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: "Home",
          tabBarColor: "#009387",
          tabBarIcon: ({ color }) => (
            <Icon name="ios-home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={MyBookings}
        options={{
          tabBarLabel: "Bookings",
          tabBarColor: "#1f65ff",
          tabBarIcon: ({ color }) => (
            <Icon name="book" color={color} size={26} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: "Profile",
          tabBarColor: "#694fad",
          tabBarIcon: ({ color }) => (
            <Icon name="ios-person" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="AboutUs"
        component={AboutUs}
        options={{
          tabBarLabel: "About Us",
          tabBarColor: "#d02860",
          tabBarIcon: ({ color }) => (
            <Icon name="ios-aperture" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabScreen;

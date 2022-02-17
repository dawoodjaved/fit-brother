import React, { Component, useState } from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback } from "react-native";
import Homestack from "./routes/HomeStack";
import { NavigationContainer } from "@react-navigation/native";

import { Provider, useSelector } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import persistedReducer from "./Redux/reducers/rootReducer";
import thunk from "redux-thunk";
import AuthStack from "./routes/AuthStack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerContent from "./routes/DrawerContent";
import { firebase } from "./firebase/config";
require("firebase/auth");
import * as Font from "expo-font";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import MainTabScreen from "./screens/MainTabScreen";

const Drawer = createDrawerNavigator();
const store = createStore(persistedReducer, applyMiddleware(thunk));
const persistor = persistStore(store);
export default class App extends Component {
  constructor(props) {
    super();
    this.state = {
      loaded: false,
      loading: true,
      user: null,
    };
  }

  async componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true,
        });
      } else {
        this.setState({
          loggedIn: true,
          loaded: true,
          user,
        });
      }
    });
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
    });
    this.setState({ loading: false });
  }
  render() {
    const { loggedIn, loaded } = this.state;

    if (!loaded && this.state.loading) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text>Loading</Text>
        </View>
      );
    }

    if (!loggedIn) {
      return (
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <NavigationContainer>
              <AuthStack />
            </NavigationContainer>
          </PersistGate>
        </Provider>
      );
    }

    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            <Drawer.Navigator
              initialRouteName="HomeDrawer"
              drawerContent={(props) => <DrawerContent {...props} />}
            >
              {this.state.user?.email === "admin@gmail.com" ? (
                <Drawer.Screen
                  name="HomeDrawer"
                  component={Homestack}
                  options={{
                    headerShown: false,
                  }}
                />
              ) : (
                <Drawer.Screen
                  name="HomeDrawer"
                  component={MainTabScreen}
                  options={{
                    headerShown: false,
                  }}
                />
              )}
            </Drawer.Navigator>
          </NavigationContainer>
        </PersistGate>
      </Provider>
    );
  }
}

import React from "react";
import { View, StyleSheet } from "react-native";
import { Title, Caption, Drawer } from "react-native-paper";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useSelector, useDispatch } from "react-redux";
import signOut from "../Redux/actions/signOutAction";
import fetchUser from "../Redux/actions/fetchUserAction";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import COLORS from "../consts/colors";

function DrawerContent() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { currentUser: user } = useSelector((state) => state.auth);

  const adminEmail = "admin@gmail.com";

  const signOutAsProps = () => {
    dispatch(signOut());
  };
  const fetchUserAsProps = () => {
    dispatch(fetchUser());
  };

  React.useEffect(() => {
    fetchUserAsProps();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.lightBlack,
      }}
    >
      <DrawerContentScrollView>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={{ flexDirection: "row", marginTop: 15 }}>
              <View style={styles.imageStyles}>
                <Title style={styles.initialStyles}>{user?.initials}</Title>
              </View>
              <View style={{ marginLeft: 15, flexDirection: "column" }}>
                <Title style={styles.title}>
                  {user?.firstName} {user?.lastName}
                </Title>
                <Caption style={styles.caption}>{user?.gender}</Caption>
              </View>
            </View>
          </View>

          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({ size }) => (
                <Icon
                  name="home-outline"
                  color={COLORS.mainColor}
                  size={size}
                />
              )}
              label="Home"
              labelStyle={{ color: COLORS.mainColor }}
              onPress={() => {
                navigation.navigate("start");
              }}
            />
            <DrawerItem
              icon={({ size }) => (
                <Icon
                  name="account-outline"
                  color={COLORS.mainColor}
                  size={size}
                />
              )}
              label="Profile"
              labelStyle={{ color: COLORS.mainColor }}
              onPress={() => {
                navigation.navigate("Profile");
              }}
            />

            {user?.email !== adminEmail && (
              <DrawerItem
                icon={({ size }) => (
                  <Icon
                    name="account-settings-outline"
                    color={COLORS.mainColor}
                    size={size}
                  />
                )}
                label="Settings"
                labelStyle={{ color: COLORS.mainColor }}
                onPress={() => {
                  navigation.navigate("SettingScreen");
                }}
              />
            )}

            {user?.email !== adminEmail && (
              <DrawerItem
                icon={({ size }) => (
                  <Icon
                    name="account-check-outline"
                    color={COLORS.mainColor}
                    size={size}
                  />
                )}
                label="About Us"
                labelStyle={{ color: COLORS.mainColor }}
                onPress={() => {
                  navigation.navigate("AboutUs");
                }}
              />
            )}

            {user?.email === adminEmail && (
              <DrawerItem
                icon={({ size }) => (
                  <Icon
                    name="account-check-outline"
                    color={COLORS.mainColor}
                    size={size}
                  />
                )}
                label="Create Class"
                labelStyle={{ color: COLORS.mainColor }}
                onPress={() => {
                  navigation.navigate("create");
                }}
              />
            )}

            {user?.email === adminEmail && (
              <DrawerItem
                icon={({ size }) => (
                  <Icon
                    name="account-check-outline"
                    color={COLORS.mainColor}
                    size={size}
                  />
                )}
                label="Bookings History"
                labelStyle={{ color: COLORS.mainColor }}
                onPress={() => {
                  navigation.navigate("history");
                }}
              />
            )}

            {user?.email === adminEmail && (
              <DrawerItem
                icon={({ size }) => (
                  <Icon
                    name="account-check-outline"
                    color={COLORS.mainColor}
                    size={size}
                  />
                )}
                label="All Users"
                labelStyle={{ color: COLORS.mainColor }}
                onPress={() => {
                  navigation.navigate("userlist");
                }}
              />
            )}
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="exit-to-app" color={COLORS.mainColor} size={size} />
          )}
          label="Sign Out"
          labelStyle={{ color: COLORS.mainColor }}
          onPress={signOutAsProps}
        />
      </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  imageStyles: {
    width: 70,
    height: 70,
    borderRadius: 70,
    backgroundColor: COLORS.mainColor,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  initialStyles: {
    color: COLORS.lightBlack,
    fontWeight: "bold",
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: "bold",
    color: COLORS.mainColor,
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    color: COLORS.mainColor,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

export default DrawerContent;

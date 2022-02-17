import * as React from "react";
import {
  StatusBar,
  FlatList,
  Image,
  Animated,
  Text,
  View,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Title } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import fetchAllUsers from "../Redux/actions/fetchAllUsersAction";
import COLORS from "../consts/colors";

const SPACING = 20;
const AVATAR_SIZE = 70;
const ITEM_SIZE = AVATAR_SIZE + SPACING * 3;

const UsersList = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.auth);

  const fetchUserAsProps = () => {
    dispatch(fetchAllUsers());
  };

  React.useEffect(() => {
    fetchUserAsProps();
  }, []);

  const scrollY = React.useRef(new Animated.Value(0)).current;
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Animated.FlatList
        data={users}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        keyExtractor={(item) => item.email}
        contentContainerStyle={{
          padding: SPACING,
          paddingTop: StatusBar.currentHeight || 42,
        }}
        renderItem={({ item, index }) => {
          const inputRange = [
            -1,
            0,
            ITEM_SIZE * index,
            ITEM_SIZE * (index + 2),
          ];
          const opacityInputRange = [
            -1,
            0,
            ITEM_SIZE * index,
            ITEM_SIZE * (index + 0.5),
          ];

          const scale = scrollY.interpolate({
            inputRange,
            outputRange: [1, 1, 1, 0],
          });

          const opacity = scrollY.interpolate({
            inputRange: opacityInputRange,
            outputRange: [1, 1, 1, 0],
          });

          return (
            <Animated.View
              style={{ ...styles.card, transform: [{ scale }], opacity }}
            >
              <View style={styles.imageStyles}>
                <Title style={styles.initialStyles}>{item.initials}</Title>
              </View>

              <View>
                <Text style={styles.text}>
                  {item.firstName} {item.lastName}
                </Text>

                <Text style={{ fontSize: 12, opacity: 0.7 }}>
                  {item.phoneNumber}
                </Text>
                <Text style={{ fontSize: 12, opacity: 0.8, color: "#0099cc" }}>
                  {item.email}
                </Text>
              </View>
            </Animated.View>
          );
        }}
      ></Animated.FlatList>
    </View>
  );
};

export default UsersList;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightBlack },
  hero: {
    flex: 3,
    marginLeft: 25,
    justifyContent: "flex-end",
    marginBottom: 30,
  },
  text: { fontSize: 12, fontWeight: "700" },
  imageStyles: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE,
    marginRight: SPACING / 2,
    backgroundColor: COLORS.lightBlack,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  initialStyles: {
    color: COLORS.mainColor,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    flexDirection: "row",
    padding: SPACING,
    backgroundColor: COLORS.mainColor,
    marginBottom: SPACING,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  error: {
    fontSize: 15,
    color: "red",
  },
});

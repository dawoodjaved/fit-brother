import React from "react";
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  FlatList,
  TouchableNativeFeedback,
  Dimensions,
} from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";
import COLORS from "../consts/colors";
import { useDispatch, useSelector } from "react-redux";
import bookClassAction from "../Redux/actions/bookClassAction";
import fetchAllClassesAction from "./../Redux/actions/fetchAllClassesAction";
import { firebase } from "../firebase/config";

const width = Dimensions.get("window").width / 2 - 30;

const MainScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const auth = firebase.auth();
  const userData = auth.currentUser;
  const { classes } = useSelector((state) => state.class);
  const { currentUser: user } = useSelector((state) => state.auth);

  const fetchClassesAsProps = () => {
    dispatch(fetchAllClassesAction());
  };

  React.useEffect(() => {
    fetchClassesAsProps();
  }, []);

  const handleforAdmin = (data) => {};

  var date = new Date().getDate();
  var month = new Date().getMonth() + 1;
  var year = new Date().getFullYear();

  const fullDate = `${date}-${month}-${year}`;

  const handleOnPress = (data) => {
    const cred = {
      userId: userData?.uid,
      email: user?.email,
      firstName: user?.firstName,
      lastName: user?.lastName,
      title: data?.title,

      time: data?.time,
      fullDate,
    };
    dispatch(bookClassAction(cred));
    console.log(cred);
  };

  const adminEmail = "admin@gmail.com";

  const Card = (props) => {
    const classData = props.class;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={
          user?.email !== adminEmail
            ? () => handleOnPress(classData)
            : () => handleforAdmin()
        }
      >
        <View style={style.card}>
          <Text>
            <Text style={{ fontWeight: "bold", fontSize: 17, marginTop: 10 }}>
              Title:
            </Text>{" "}
            {classData.title}
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 2,
            }}
          >
            <Text>
              <Text style={{ fontWeight: "bold", fontSize: 17, marginTop: 10 }}>
                Time:{" "}
              </Text>
              {classData.time}
            </Text>
          </View>

          {user?.email !== adminEmail && (
            <View>
              <TouchableNativeFeedback>
                <View style={style.bookme}>
                  <Text style={style.bookmeText}>Book Me</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: COLORS.lightBlack,
      }}
    >
      <View style={style.header}>
        <View>
          <Text
            style={{
              fontSize: 25,
              fontWeight: "bold",
              color: COLORS.mainColor,
            }}
          >
            Welcome to
          </Text>
          <Text
            style={{
              fontSize: 38,
              color: COLORS.mainColor,
              fontWeight: "bold",
            }}
          >
            TRT
          </Text>
        </View>
      </View>
      <View style={{ marginTop: 30, flexDirection: "row" }}>
        <View style={style.searchContainer}>
          <Icon name="search" size={25} style={{ marginLeft: 20 }} />
          <TextInput placeholder="Search" style={style.input} />
        </View>
        <View style={style.sortBtn}>
          <Icon name="sort" size={30} color={COLORS.lightBlack} />
        </View>
      </View>
      <FlatList
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          marginTop: 10,
          paddingBottom: 50,
        }}
        numColumns={2}
        data={classes}
        renderItem={({ item }) => {
          return <Card class={item} />;
        }}
      />
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  bookme: {
    width: "80%",
    backgroundColor: COLORS.lightBlack,
    paddingVertical: 2,
    alignItems: "center",
    borderRadius: 30,
    elevation: 2,
    marginTop: 20,
  },
  bookmeText: {
    color: COLORS.mainColor,
    fontSize: 15,
  },
  card: {
    height: 225,
    backgroundColor: COLORS.mainColor,
    width,
    marginHorizontal: 2,
    borderRadius: 10,
    marginBottom: 20,
    padding: 15,
  },
  header: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  searchContainer: {
    height: 50,
    backgroundColor: COLORS.light,
    borderRadius: 10,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    color: COLORS.dark,
  },
  sortBtn: {
    marginLeft: 10,
    height: 50,
    width: 50,
    borderRadius: 10,
    backgroundColor: COLORS.mainColor,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default MainScreen;

import { StyleSheet } from "react-native";
import COLORS from "../consts/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.mainColor,
  },
  hero: {
    flex: 3,
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
  buttonContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
});

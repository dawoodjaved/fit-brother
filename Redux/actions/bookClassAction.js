import { firebase } from "../../firebase/config";
require("firebase/auth");
const bookClassAction = (credentials) => {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("bookings")
      .add(credentials)
      .then(() => {
        dispatch({ type: "ADD_BOOKING_SUCCESS" });
      })
      .catch((error) => {
        //error is assigned by ES6 refactoring.
        dispatch({ type: "BOOKING_ERROR", error });
      });
  };
};

export default bookClassAction;

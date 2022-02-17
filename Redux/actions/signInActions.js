import { firebase } from "../../firebase/config";
require("firebase/auth");
const signIn = (credentials) => {
  return (dispatch) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(() => {
        dispatch({ type: "LOGIN_SUCCESS" });
      })
      .catch((error) => {
        //error is assigned by ES6 refactoring.
        dispatch({ type: "LOGIN_ERROR", error });
      });
  };
};

export default signIn;

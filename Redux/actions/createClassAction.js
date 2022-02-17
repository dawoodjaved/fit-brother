import { firebase } from "../../firebase/config";
require("firebase/auth");
const createClassAction = (credentials) => {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("classes")
      .add(credentials)
      .then(() => {
        dispatch({ type: "ADD_SUCCESS" });
      })
      .catch((error) => {
        //error is assigned by ES6 refactoring.
        dispatch({ type: "CLASS_ERROR", error });
      });
  };
};

export default createClassAction;

import { firebase, projectFirestore } from "../../firebase/config";
require("firebase/auth");

const signUpAction = (userObject) => {
  return (dispatch) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(userObject.email, userObject.password)
      .then((result) => {
        projectFirestore
          .collection("users")
          .doc(result.user.uid)
          .set({
            firstName: userObject.firstName,
            lastName: userObject.lastName,
            phoneNumber: userObject.phoneNumber,
            gender: userObject.gender,
            initials: userObject.firstName[0] + userObject.lastName[0],
            email: userObject.email,
          })
          .then(() => {
            dispatch({ type: "SIGNUP_SUCCESS" });
          });
      })
      .catch((error) => {
        dispatch({ type: "SIGNUP_ERROR", error });
      });
  };
};
export default signUpAction;

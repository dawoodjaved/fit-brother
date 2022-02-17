import { firebase } from "../../firebase/config";
require("firebase/firestore");
const fetchAllUsers = () => {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("users")
      .get()
      .then((snapshot) => {
        dispatch({
          type: "USERS_STATE_CHANGE",
          users: snapshot.docs.map((doc) => doc.data()),
        });
      });
  };
};

export default fetchAllUsers;

import { firebase } from "../../firebase/config";
require("firebase/firestore");
const fetchAllClassesAction = () => {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("classes")
      .get()
      .then((snapshot) => {
        dispatch({
          type: "CLASSES_SUCCESS",
          classes: snapshot.docs.map((doc) => doc.data()),
        });
      });
  };
};

export default fetchAllClassesAction;

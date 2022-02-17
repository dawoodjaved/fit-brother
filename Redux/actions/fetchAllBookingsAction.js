import { firebase } from "../../firebase/config";
require("firebase/firestore");
const fetchAllBookingsAction = () => {
  var date = new Date().getDate();
  var month = new Date().getMonth() + 1;
  var year = new Date().getFullYear();

  const id = firebase.auth().currentUser.uid;
  const finalDate = `${date}-${month}-${year}`;
  return (dispatch) => {
    firebase
      .firestore()
      .collection("bookings")
      .where("fullDate", "==", finalDate)
      .where("userId", "==", id)
      .get()
      .then((snapshot) => {
        dispatch({
          type: "BOOKING_SUCCESS",
          bookings: snapshot.docs.map((doc) => doc.data()),
        });
      });
  };
};

export default fetchAllBookingsAction;

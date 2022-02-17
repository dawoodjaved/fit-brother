import { firebase } from "../../firebase/config";
require("firebase/firestore");
const fetchTodayBookingsAction = () => {
  var date = new Date().getDate();
  var month = new Date().getMonth() + 1;
  var year = new Date().getFullYear();

  const finalDate = `${date}-${month}-${year}`;

  return (dispatch) => {
    firebase
      .firestore()
      .collection("bookings")
      .where("fullDate", "==", finalDate)
      .get()
      .then((snapshot) => {
        dispatch({
          type: "ALL_BOOKINGS",
          allBookings: snapshot.docs.map((doc) => doc.data()),
        });
      });
  };
};

export default fetchTodayBookingsAction;

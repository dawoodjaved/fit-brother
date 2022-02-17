const initState = {
  classError: null,
  currentBooking: null,
  bookings: null,
};
const bookingClassReducer = (state = initState, action) => {
  switch (action.type) {
    case "ADD_BOOKING_SUCCESS":
      return {
        ...state,
        classError: null,
      };
    case "BOOKING_ERROR":
      return {
        ...state,
        classError: action.error.message,
      };
    case "BOOKING_SUCCESS":
      return {
        ...state,
        bookings: action.bookings,
      };
    case "UPDATES_SUCCESS":
      return {
        ...state,
        currentBooking: action.currentBooking,
      };
    case "DELETES_SUCCESS":
      return {
        ...state,
        currentBooking: action.currentBooking,
      };
    default:
      return state;
  }
};

export default bookingClassReducer;

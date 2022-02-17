const initState = {
  todayBookingError: null,
  allBookings: null,
};
const todayBookingReducer = (state = initState, action) => {
  switch (action.type) {
    case "ALL_BOOKINGS":
      return {
        ...state,
        allBookings: action.allBookings,
      };
    default:
      return state;
  }
};

export default todayBookingReducer;

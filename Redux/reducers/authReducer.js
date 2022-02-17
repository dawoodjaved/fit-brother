const initState = {
  authError: null,
  currentUser: null,
  users: null,
};

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case "USERS_STATE_CHANGE":
      return {
        ...state,
        users: action.users,
      };
    case "USER_STATE_CHANGE":
      return {
        ...state,
        currentUser: action.currentUser,
      };
    case "LOGIN_SUCCESS":
      return (state = {
        authError: null,
      });

    case "LOGIN_ERROR":
      return (state = {
        authError: action.error.message,
      });
    case "LOGOUT_SUCCESS":
      return (state = {
        authError: null,
        currentUser: null,
      });

    case "SIGNUP_SUCCESS":
      return (state = {
        authError: null,
      });

    case "SIGNUP_ERROR":
      return (state = {
        authError: action.error.message,
      });

    case "CLEAR_DATA":
      return initState;
    default:
      return state;
  }
};

export default authReducer;

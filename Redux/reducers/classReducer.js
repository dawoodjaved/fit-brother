const initState = {
  classError: null,
  currentClass: null,
  classes: null,
};
const ClassReducer = (state = initState, action) => {
  switch (action.type) {
    case "ADD_SUCCESS":
      return {
        ...state,
        classError: null,
      };
    case "CLASS_ERROR":
      return {
        classError: action.error.message,
      };
    case "CLASSES_SUCCESS":
      return {
        ...state,
        classes: action.classes,
      };
    case "UPDATE_SUCCESS":
      return {
        ...state,
        currentClass: action.currentClass,
      };
    case "DELETE_SUCCESS":
      return {
        ...state,
        currentClass: action.currentClass,
      };
    default:
      return state;
  }
};

export default ClassReducer;

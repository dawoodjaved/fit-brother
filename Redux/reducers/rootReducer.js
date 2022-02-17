import authReducer from "./authReducer";

import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ClassReducer from "./classReducer";
import bookingClassReducer from "./bookingClassReducer";
import todayBookingReducer from "./todayBookingReducer";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  auth: authReducer,
  class: ClassReducer,
  booking: bookingClassReducer,
  todayBooking: todayBookingReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
export default persistedReducer;

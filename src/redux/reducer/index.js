import { combineReducers } from "@reduxjs/toolkit";
import auth from "./auth";

const appReducer = combineReducers({
  auth
});
const rootReducer = (state, action) => {
  if (action.type === "logout/auth/fulfilled") {
    state = {};
    localStorage.clear();
  }

  return appReducer(state, action);
};

export default rootReducer;

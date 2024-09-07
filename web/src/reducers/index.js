import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userReducer"; // מייבא את ה-userReducer

const rootReducer = combineReducers({
  user: userReducer,
  // תוכל להוסיף כאן עוד reducers אם יש
});

export default rootReducer;

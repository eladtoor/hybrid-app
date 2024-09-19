import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../redux/reducers/index.js"; // ייבוא ה-rootReducer המעודכן

const store = configureStore({
  reducer: rootReducer, // עכשיו rootReducer כולל את כל ה-reducers
  devTools: process.env.NODE_ENV !== "production", // תמיכה ב-Redux DevTools
});

export default store;

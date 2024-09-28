import { combineReducers } from "redux";
import userReducer from "./userReducer";
import productReducer from "./productReducer";
import categoryReducer from "./categoryReducer"; // ייבוא ה-Reducer החדש
import cartReducer from "../slices/cartSlice";

const rootReducer = combineReducers({
  user: userReducer,
  products: productReducer,
  categories: categoryReducer,
  cart: cartReducer,
  // הוספת ה-Reducer של הקטגוריות
});

export default rootReducer;

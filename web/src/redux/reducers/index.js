import { combineReducers } from "redux";
import userReducer from "./userReducer";
import productReducer from "./productReducer";
import categoryReducer from "./categoryReducer"; // ייבוא ה-Reducer החדש

const rootReducer = combineReducers({
  user: userReducer,
  products: productReducer,
  categories: categoryReducer, // הוספת ה-Reducer של הקטגוריות
});

export default rootReducer;

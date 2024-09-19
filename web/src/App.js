import React, { useEffect }, { useEffect } from "react"; 
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux"; // ייבוא ה-Provider של Redux
import store from "./redux/store.js";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import Footer from "./components/Footer";
import UserInfoForm from "./components/UserInfoForm";
import { Subcategory } from "./pages/Subcategory";
import ProductPage from "./pages/ProductPage";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "./redux/actions/categoryActions.js"; // או הנתיב הנכון לפונקציות האקשן

function App() {
  const categories = useSelector((state) => state.categories.categories); // משיכת הקטגוריות מה-Redux

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <Provider store={store}>
      <Router>
        <NavBar categories={categories} />

        <Routes>
          <Route path="/" element={<HomePage categories={categories} />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/user-info" element={<UserInfoForm />} />
          <Route path="/:title/:subcategoryName" element={<Subcategory />} />
          <Route path="/product/:id" element={<ProductPage />} />
        </Routes>
        <Footer />
      </Router>
    </Provider>
  );
}

export default App;

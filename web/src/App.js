import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import UserProfile from "./pages/UserProfile.jsx";
import LoginPage from "./pages/LoginPage";
import Footer from "./components/Footer";
import UserInfoForm from "./components/UserInfoForm";
import { Subcategory } from "./pages/Subcategory";
import ProductsPage from "./pages/ProductsPage.jsx";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "./redux/actions/categoryActions";
import { fetchProducts } from "./redux/actions/productActions";
import SearchResults from "./pages/SearchResults";
import AdminPanel from "./pages/AdminPanel"; // Import AdminPanel
import AdminRoute from "./components/AdminRoute"; // Import the AdminRoute component

function App() {
  const categories = useSelector((state) => state.categories.categories);
  const products = useSelector((state) => state.products.products);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedCategories = localStorage.getItem("categories");
    const storedProducts = localStorage.getItem("products");

    if (storedCategories) {
      dispatch({
        type: "SET_CATEGORIES_FROM_STORAGE",
        payload: JSON.parse(storedCategories),
      });
    } else {
      dispatch(fetchCategories());
    }

    if (storedProducts) {
      dispatch({
        type: "SET_PRODUCTS_FROM_STORAGE",
        payload: JSON.parse(storedProducts),
      });
    } else {
      dispatch(fetchProducts());
    }
  }, [dispatch]);

  useEffect(() => {
    if (categories.length) {
      localStorage.setItem("categories", JSON.stringify(categories));
    }

    if (products.length) {
      localStorage.setItem("products", JSON.stringify(products));
    }
  }, [categories, products]);

  return (
    <Provider store={store}>
      <Router>
        <NavBar categories={categories} />

        <Routes>
          <Route
            path="/"
            element={<HomePage categories={categories} products={products} />}
          />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/user-info" element={<UserInfoForm />} />
          <Route path="/:title/:subcategoryName" element={<Subcategory />} />
          <Route
            path="/:companyName/:categoryname/:subcategoryname/products"
            element={<ProductsPage />}
          />
          <Route
            path="/search"
            element={<SearchResults products={products} />}
          />
          <Route path="/profile" element={<UserProfile />} />

          {/* Admin Panel Route - Protected */}
          <Route
            path="/admin"
            element={<AdminRoute element={<AdminPanel />} />}
          />
        </Routes>

        <Footer />
      </Router>
    </Provider>
  );
}

export default App;

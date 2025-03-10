import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react"; // Import PersistGate
import store, { persistor } from "./redux/store.js"; // Import store and persistor
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
import UserManagement from "./pages/UserManagement";
import PurchaseHistory from "./pages/PurchaseHistory";
import AgentDashboard from "./pages/AgentDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import FloatingWhatsAppButton from "./components/FloatingWhatsAppButton";
import OrderConfirmation from "./pages/OrderConfirmation"; // Import
import ScrollToTop from "./components/ScrollToTop"; // Import the new component
import './App.css'; // חיבור Tailwind


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
      dispatch(fetchCategories()); // ✅ Fetch only if not in localStorage
    }

    if (storedProducts) {
      dispatch({
        type: "SET_PRODUCTS_FROM_STORAGE",
        payload: JSON.parse(storedProducts),
      });
    } else {
      dispatch(fetchProducts());
    }

    // ✅ Listen for WebSocket updates (ensures live updates)
    // ✅ Listen for WebSocket updates (ensures live updates)
    window.socket?.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "CATEGORIES_UPDATED") {
        console.log(
          "🔄 WebSocket: Received Updated Categories",
          message.payload
        );

        // ✅ Ensure correct format
        const formattedCategories = {
          companyName: "טמבור",
          companyCategories: message.payload, // Wrap categories inside the correct structure
        };

        // ✅ Update Redux state and localStorage
        dispatch({ type: "SET_CATEGORIES", payload: formattedCategories });
        localStorage.setItem("categories", JSON.stringify(formattedCategories));
      }
    });
  }, [dispatch]);

  return (
    <Provider store={store}>
      <PersistGate loading={<p>Loading...</p>} persistor={persistor}>
        <Router>
          <ScrollToTop /> {/* Ensures every route starts from top */}
          <NavBar categories={categories} />
          <Routes>
            <Route
              path="/"
              element={<HomePage categories={categories} products={products} />}
            />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
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
              path="/admin-panel"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            />
            <Route path="/user-management" element={<UserManagement />} />
            <Route
              path="/purchase-history/:userId/:userName"
              element={<PurchaseHistory />}
            />
            <Route
              path="/agent-dashboard"
              element={
                <ProtectedRoute>
                  <AgentDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer />
          <FloatingWhatsAppButton />
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;

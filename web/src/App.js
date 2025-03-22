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
import AdminPanel from "./pages/AdminPanel";
import AdminRoute from "./components/AdminRoute";
import UserManagement from "./pages/UserManagement";
import PurchaseHistory from "./pages/PurchaseHistory";
import AgentDashboard from "./pages/AgentDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import FloatingWhatsAppButton from "./components/FloatingWhatsAppButton";
import OrderConfirmation from "./pages/OrderConfirmation";
import ScrollToTop from "./components/ScrollToTop";
import TermsPrivacy from "./pages/Terms.jsx";
import "./App.css";
import RegisterPage from "./pages/RegisterPage.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";

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

    // ✅ WebSocket for real-time updates (with cleanup)
    const handleWebSocketMessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "CATEGORIES_UPDATED") {
        console.log(
          "🔄 WebSocket: Received Updated Categories",
          message.payload
        );
        const formattedCategories = {
          companyName: "טמבור",
          companyCategories: message.payload,
        };
        dispatch({ type: "SET_CATEGORIES", payload: formattedCategories });
        localStorage.setItem("categories", JSON.stringify(formattedCategories));
      }
    };

    window.socket?.addEventListener("message", handleWebSocketMessage);

    return () => {
      window.socket?.removeEventListener("message", handleWebSocketMessage);
    };
  }, [dispatch]);

  return (
    <Provider store={store}>
      <PersistGate loading={<p>Loading...</p>} persistor={persistor}>
        <Router>
          <div className="flex flex-col min-h-screen">
            <ScrollToTop />
            <NavBar categories={categories} />

            <main className="flex-grow">
              <Routes>
                <Route
                  path="/"
                  element={
                    <HomePage categories={categories} products={products} />
                  }
                />
                <Route path="/cart" element={<CartPage />} />
                <Route
                  path="/order-confirmation"
                  element={<OrderConfirmation />}
                />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/user-info" element={<UserInfoForm />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route
                  path="/:title/:subcategoryName"
                  element={<Subcategory />}
                />
                <Route
                  path="/:companyName/:categoryname/:subcategoryname/products"
                  element={<ProductsPage />}
                />
                <Route path="/order-success" element={<OrderSuccess />} />

                <Route path="/search" element={<SearchResults />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/terms-privacy" element={<TermsPrivacy />} />
                {/* Admin & Protected Routes */}
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
            </main>

            <Footer />
            <FloatingWhatsAppButton />
          </div>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;

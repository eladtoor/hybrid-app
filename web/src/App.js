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

import UserManagement from "./pages/UserManagement";
import PurchaseHistory from "./pages/PurchaseHistory";
import AgentDashboard from "./pages/AgentDashboard.jsx";

import FloatingWhatsAppButton from "./components/FloatingWhatsAppButton";
import OrderConfirmation from "./pages/OrderConfirmation";
import ScrollToTop from "./components/ScrollToTop";
import TermsPrivacy from "./pages/Terms.jsx";
import "./App.css";
import RegisterPage from "./pages/RegisterPage.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { setUser } from "./redux/reducers/userReducer";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import TestCrash from "./pages/TestCrash";
import ErrorBoundary from "./components/ErrorBoundary";
import { maybeFetchProducts } from "./redux/actions/productActions";
import { maybeFetchCategories } from "./redux/actions/categoryActions.js";
import DeliveryDays from "./pages/DeliveryDays";

function App() {
  const categories = useSelector((state) => state.categories.categories);
  const products = useSelector((state) => state.products.products);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.exists() ? userSnap.data() : {};

        dispatch(
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            name: userData.name || "",
            isCreditLine: userData.isCreditLine || false,
            userType: userData.userType || "user", // או admin/agent לפי מה שמוגדר אצלך
            ...userData, // במידה ויש לך עוד שדות שתרצה להביא
          })
        );
      } else {
        dispatch(setUser(null));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    dispatch(maybeFetchCategories());
    dispatch(maybeFetchProducts());

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
        <ErrorBoundary>
          <Router>
            <NavBar categories={categories} />
            <div className="flex flex-col min-h-screen bg-wall-texture bg-cover bg-fixed bg-center bg-white/40 bg-blend-lighten">
              {" "}
              <ScrollToTop />
              <main className="flex-grow">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <HomePage categories={categories} products={products} />
                    }
                  />
                  <Route path="/delivery-days" element={<DeliveryDays />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/test-crash" element={<TestCrash />} />

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
                      <RoleProtectedRoute allowedRoles={["admin"]}>
                        <AdminPanel />
                      </RoleProtectedRoute>
                    }
                  />
                  <Route
                    path="/user-management"
                    element={
                      <RoleProtectedRoute allowedRoles={["admin"]}>
                        <UserManagement />
                      </RoleProtectedRoute>
                    }
                  />
                  <Route
                    path="/purchase-history/:userId/:userName"
                    element={<PurchaseHistory />}
                  />
                  <Route
                    path="/agent-dashboard"
                    element={
                      <RoleProtectedRoute allowedRoles={["agent", "סוכן"]}>
                        <AgentDashboard />
                      </RoleProtectedRoute>
                    }
                  />
                </Routes>
              </main>
              <Footer />
              <FloatingWhatsAppButton />
              <ToastContainer
                position="top-center"
                autoClose={3000}
                pauseOnHover={false}
                closeOnClick
                draggable={false}
                newestOnTop
                rtl
                transition={Zoom}
                toastClassName="z-[99999] mx-auto bg-white text-red-700 border border-red-300 shadow-md rounded px-4 pe-10 py-3 text-sm w-fit pointer-events-auto"
                bodyClassName="font-semibold text-center"
              />
            </div>
          </Router>
        </ErrorBoundary>
      </PersistGate>
    </Provider>
  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux"; // ייבוא ה-Provider של Redux
import store from "./store"; // ייבוא ה-Store של Redux
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage"; // ייבוא דף הכניסה
import Footer from "./components/Footer";
import UserInfoForm from "./components/UserInfoForm";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <NavBar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/user-info" element={<UserInfoForm />} />
        </Routes>

        <Footer />
      </Router>
    </Provider>
  );
}

export default App;

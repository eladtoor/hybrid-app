import React, { useEffect } from "react"; 
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import store from "./store"; 
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage"; 
import Footer from "./components/Footer";
import UserInfoForm from "./components/UserInfoForm";
import UserProfile from "./pages/UserProfile";
import { setUser } from './reducers/userReducer';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  return (
    <Provider store={store}>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/user-info" element={<UserInfoForm />} />
          <Route path="/profile" element={<UserProfile />} /> 
        </Routes>
        <Footer />
      </Router>
    </Provider>
  );
}

export default App;

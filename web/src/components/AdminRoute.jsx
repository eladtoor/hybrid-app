import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const userInfo = useSelector((state) => state.user?.user);
    const userFromStorage = JSON.parse(localStorage.getItem('user')); // Fallback to local storage

    // Check if user is logged in
    if (!userInfo && !userFromStorage) {
        return <Navigate to="/login" />;
    }

    // Check if user is an admin
    const isAdmin = userInfo?.isAdmin || userFromStorage?.isAdmin;
    if (!isAdmin) {
        return <Navigate to="/" />;
    }

    return children; // Render the protected component
};

export default AdminRoute;

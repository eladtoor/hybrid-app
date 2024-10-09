import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ element: Component }) => {
    const userInfo = useSelector((state) => state.user?.user);

    // Check if user is an admin, otherwise redirect to login
    if (!userInfo) {
        return <Navigate to="/login" />;
    }

    return userInfo.isAdmin ? Component : <Navigate to="/" />;
};

export default AdminRoute;

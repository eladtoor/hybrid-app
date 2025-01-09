import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
    const user = useSelector((state) => state.user.user);

    if (!user) {
        // If no user is logged in, redirect to login
        return <Navigate to="/login" />;
    }

    if (user.userType !== 'סוכן') {
        // If the user is not an agent, redirect to the homepage
        return <Navigate to="/" />;
    }

    // Render the protected content for agent users
    return children;
};

export default ProtectedRoute;

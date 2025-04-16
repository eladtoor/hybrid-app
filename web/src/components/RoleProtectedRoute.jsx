import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const RoleProtectedRoute = ({ children, allowedRoles }) => {
    const user = useSelector((state) => state.user?.user);

    // עדיין טוען / או לא מחובר
    if (user === undefined) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-orange-500"></div>
            </div>
        );
    }

    // הגנה מפני null
    if (!user || (!user.userType && !user.isAdmin)) {
        return <Navigate to="/" />;
    }

    // תמיכה גם ב־isAdmin וגם ב־userType
    const isAuthorized =
        allowedRoles.includes(user.userType) ||
        (allowedRoles.includes("admin") && user.isAdmin);

    if (!isAuthorized) {
        return <Navigate to="/" />;
    }

    return children;
};

export default RoleProtectedRoute;

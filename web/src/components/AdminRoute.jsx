import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const userInfo = useSelector((state) => state.user?.user);

    // בדיקה אם המשתמש נטען מהרדוסר
    if (!userInfo) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    // בדיקה האם המשתמש הוא אדמין
    if (!userInfo?.isAdmin) {
        return <Navigate to="/" />;
    }

    return children; // הצגת התוכן המוגן
};

export default AdminRoute;

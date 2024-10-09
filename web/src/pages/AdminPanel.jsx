import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
    const navigate = useNavigate();
    const userInfo = useSelector((state) => state.user?.user);

    const [showForm, setShowForm] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);

    useEffect(() => {
        // If userInfo is undefined or user is not an admin, redirect to login
        if (!userInfo || !userInfo.isAdmin) {
            alert('Access Denied. Admins Only.');
            navigate('/login');
        }
    }, [userInfo, navigate]);

    // Function to handle adding a product
    const handleAddProduct = () => {
        setProductToEdit(null); // No product to edit when adding a new one
        setShowForm(true); // Show form for adding a product
    };

    if (!userInfo?.isAdmin) {
        return <p>Access Denied</p>;
    }

    return (
        <div className="admin-panel">
            <h1>Admin Panel</h1>
            <button onClick={handleAddProduct}>Add New Product</button>
            {/* Placeholder for the product form - we'll add this functionality later */}
            {showForm && (
                <div>
                    <p>Product form will be here (Coming soon...)</p>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;

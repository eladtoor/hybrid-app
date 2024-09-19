import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ProductCard.css'; // Assuming you'll add the CSS styles

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/product/${product.id}`);  // Navigates to the product page using the product ID
    };

    return (
        <div className="product-card" onClick={handleCardClick}>
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-details">
                <h3 className="product-name">{product.name}</h3>
            </div>
        </div>
    );
};

export default ProductCard;
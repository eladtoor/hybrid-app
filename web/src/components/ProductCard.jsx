import React from 'react';
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
    return (
        <div className="product-card">
            <img src={product.image} alt={product.productName} className="product-card-image" />
            <h3 className="product-card-title">{product.productName}</h3>
            <p className="product-card-description">{product.description}</p>
            <div className="product-card-footer">
                {product.price ? (
                    <span className="product-card-price">{`₪${product.price}`}</span>
                ) : (
                    <span className="product-card-price">מחיר לא זמין</span>
                )}
                <button className="product-card-button">הוסף לעגלה</button>
            </div>
        </div>
    );
};

export default ProductCard;
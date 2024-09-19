import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ProductCard.css'; 

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const [showFullDescription, setShowFullDescription] = useState(false);

    const handleCardClick = () => {
        navigate(`/product/${product._id}`);
    };

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    const MAX_DESCRIPTION_LENGTH = 100; // מספר התווים לתיאור מקוצר
    const shortDescription = product["תיאור קצר"] ? product["תיאור קצר"].substring(0, MAX_DESCRIPTION_LENGTH) + '...' : 'אין תיאור זמין';

    return (
        <div className="product-card" onClick={handleCardClick}>
            <img src={product.תמונות} alt={product.שם} className="product-image" />
            <div className="product-details">
                <h3 className="product-name">{product.שם}</h3>
                
                {/* תיאור עם כפתור "הראה עוד" */}
                <p className="product-description">
                    {showFullDescription
                        ? product["תיאור קצר"]
                        : shortDescription}
                </p>
                {product["תיאור קצר"] && product["תיאור קצר"].length > MAX_DESCRIPTION_LENGTH && (
                    <button className="show-more" onClick={(e) => {e.stopPropagation(); toggleDescription();}}>
                        {showFullDescription ? "הראה פחות" : "הראה עוד"}
                    </button>
                )}

                {/* ניהול מלאי עם className דינמי */}
                <p className={`product-availability ${product["במלאי"] ? 'in-stock' : 'out-of-stock'}`}>
                    {product["במלאי"] ? "במלאי" : "לא זמין"}
                </p>
            </div>
        </div>
    );
};

export default ProductCard;

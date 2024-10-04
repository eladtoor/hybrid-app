import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice'
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);



    const handleAddToCart = () => {
        // הוספת מחיר ברירת מחדל אם הוא NULL
        const productToAdd = {
            ...product,
            quantity: product.quantity > 0 ? product.quantity : 1,
            price: product.price !== null && product.price !== undefined ? product.price : 0 // מחיר ברירת מחדל ₪0
        };



        dispatch(addToCart(productToAdd));
        setShowSuccessMessage(true);

        // הסתרת הודעת הצלחה לאחר 3 שניות
        setTimeout(() => {
            setShowSuccessMessage(false);
        }, 3000);
    };

    return (
        <div className="product-card">

            <img src={product.image || product.תמונות} alt={product.productName} className="product-card-image" />
            <h3 className="product-card-title">{product.productName}</h3>
            <p className="product-card-description">{product.description}</p>
            <div className="product-card-footer">
                {product.price !== null && product.price !== undefined ? (
                    <span className="product-card-price">{`₪${product.price}`}</span>
                ) : (
                    <span className="product-card-price">מחיר לא זמין</span>
                )}
                <button className="product-card-button" onClick={handleAddToCart}>
                    הוסף לעגלה
                </button>
            </div>

            {/* הצגת הודעת הצלחה */}
            {showSuccessMessage && (
                <div className="success-message-container">
                    <h3 className="success-message">המוצר התווסף בהצלחה!</h3>
                </div>
            )}
        </div>
    );
};

export default ProductCard;

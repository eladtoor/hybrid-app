import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);

    // פונקציה לפתיחה וסגירה של ה-Modal
    const toggleModal = () => {
        setShowModal(!showModal);
    };

    // פונקציה לסגירת המודל גם בלחיצה על החלק הקהה מחוץ למודל
    const handleCloseModalOnBackgroundClick = (e) => {
        if (e.target.className === 'modal') {
            toggleModal();
        }
    };

    return (
        <>
            {/* כל הכרטיס לחיץ */}
            <div className="product-card" onClick={toggleModal}>
                <img src={product.תמונות} alt={product.שם} className="product-card-image" />
                <h3 className="product-card-title">{product.שם}</h3>
                {/* הצגת תיאור קצר אם קיים, אחרת תיאור */}
                <p className="product-card-description">
                    {product["תיאור קצר"] ? product["תיאור קצר"] : product["תיאור"]}
                </p>
                <div className="product-card-footer">
                    {/* הצגת המחיר מעל הכפתור */}
                    {product["מחיר רגיל"] && !isNaN(product["מחיר רגיל"]) ? (
                        <span className="product-card-price">{`₪${Number(product["מחיר רגיל"]).toFixed(2)}`}</span>
                    ) : (
                        <span className="product-card-price">מחיר לא זמין</span>
                    )}
                </div>
            </div>

            {/* Modal הצגת */}
            {showModal && (
                <div className="modal" onClick={handleCloseModalOnBackgroundClick}>
                    <div className="modal-content">
                        <span className="close" onClick={toggleModal}>&times;</span>
                        <h2>{product.שם}</h2>
                        <img src={product.תמונות} alt={product.שם} className="modal-image" />
                        {/* הצגת תיאור מלא אם קיים, אחרת תיאור קצר */}
                        <p>
                            {product["תיאור"] ? product["תיאור"] : product["תיאור קצר"]}
                        </p>
                        <p>{`מחיר: ₪${product["מחיר רגיל"]}`}</p>
                        <button className="product-card-button" onClick={() => dispatch(addToCart(product))}>
                            הוסף לעגלה
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductCard;
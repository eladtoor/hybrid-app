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

    // פונקציה להצגת attributes בצורה של dropdown אם יש יותר מאחד
    const renderAttributes = () => {
        const attributes = product.attributes;

        // בדיקה אם attributes קיים, שהוא לא undefined ולא null
        if (!attributes || attributes.length === 0) {
            return <p>אין מאפיינים למוצר זה.</p>; // אם המאפיינים ריקים או לא קיימים
        }

        // בדיקה האם attributes הוא מערך
        if (Array.isArray(attributes)) {
            // אם זה מערך, נבדוק את התוכן
            return attributes.map((attribute, index) => {
                const [attributeName, attributeValue] = Object.entries(attribute)[0];

                // אם יש ערך אחד בלבד - הצג כטקסט רגיל
                if (!Array.isArray(attributeValue) || attributeValue.length === 1) {
                    return (
                        <div key={index} className="attribute">
                            <strong>{attributeName}: </strong>
                            <span>{Array.isArray(attributeValue) ? attributeValue[0] : attributeValue}</span>
                        </div>
                    );
                }

                // אם יש מספר ערכים - הצג כ-dropdown לבחירה
                return (
                    <div key={index} className="attribute">
                        <strong>{attributeName}: </strong>
                        <select>
                            {attributeValue.map((value, idx) => (
                                <option key={idx} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </div>
                );
            });
        }

        // אם זה לא מערך, זה אובייקט (או כל דבר אחר לא צפוי), מטפל בהתאם
        if (typeof attributes === 'object') {
            return Object.entries(attributes).map(([attributeName, attributeValue], index) => (
                <div key={index} className="attribute">
                    <strong>{attributeName}: </strong>
                    <span>{attributeValue}</span>
                </div>
            ));
        }

        // אם המידע לא במבנה תקין
        return <p>אין מאפיינים למוצר זה.</p>;
    };

    return (
        <>
            {/* כל הכרטיס לחיץ */}
            <div className="product-card" onClick={toggleModal}>
                <img src={product.תמונות} alt={product.שם} className="product-card-image" />
                <h3 className="product-card-title">{product.שם}</h3>
                <p className="product-card-description">
                    {product["תיאור קצר"] ? product["תיאור קצר"] : product["תיאור"]}
                </p>
                <div className="product-card-footer">
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
                        <p>{product["תיאור"] ? product["תיאור"] : product["תיאור קצר"]}</p>
                        <p>{`מחיר: ₪${product["מחיר רגיל"]}`}</p>

                        {/* הצגת attributes */}
                        <div className="product-attributes">
                            {renderAttributes()}
                        </div>

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

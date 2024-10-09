import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [selectedAttributes, setSelectedAttributes] = useState({});

    useEffect(() => {
        if (product.variations && product.variations.length > 0) {
            const attributeOptions = {};
            product.variations.forEach((variation) => {
                const attributes = variation.attributes;
                for (const [key, value] of Object.entries(attributes)) {
                    if (!attributeOptions[key]) {
                        attributeOptions[key] = new Set();
                    }
                    attributeOptions[key].add(value);
                }
            });
            // Set default selected attribute if there is only one value
            const defaultAttributes = {};
            Object.entries(attributeOptions).forEach(([attributeName, values]) => {
                if (values.size === 1) {
                    defaultAttributes[attributeName] = [...values][0];
                }
            });
            setSelectedAttributes(defaultAttributes);
        }
    }, [product.variations]);

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

    // פונקציה לעדכון הערך שנבחר ברדיו
    const handleAttributeChange = (attributeName, value) => {
        setSelectedAttributes((prevSelectedAttributes) => ({
            ...prevSelectedAttributes,
            [attributeName]: value,
        }));
    };

    // פונקציה להצגת מאפיינים אם המוצר הוא מסוג variable
    const renderVariationAttributes = () => {
        if (product.variations && product.variations.length > 0) {
            const attributeOptions = {};

            // איסוף כל הערכים של המאפיינים מכל הווריאציות
            product.variations.forEach((variation) => {
                const attributes = variation.attributes;
                for (const [key, value] of Object.entries(attributes)) {
                    if (!attributeOptions[key]) {
                        attributeOptions[key] = new Set();
                    }
                    attributeOptions[key].add(value);
                }
            });

            // יצירת כפתורי רדיו עבור כל מאפיין
            return Object.entries(attributeOptions).map(([attributeName, values], index) => (
                <div key={index} className="attribute">
                    <strong>{attributeName}:</strong>
                    {[...values].map((value) => (
                        <label
                            key={value}
                            className={selectedAttributes[attributeName] === value ? 'selected' : ''}
                        >
                            <input
                                type="radio"
                                name={attributeName}
                                value={value}
                                checked={selectedAttributes[attributeName] === value}
                                onChange={() => handleAttributeChange(attributeName, value)}
                            />
                            {value}
                        </label>
                    ))}
                </div>
            ));
        }
        return null;
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

                        {/* הצגת attributes אם זה מוצר מסוג variable */}
                        {product.סוג === 'variable' && (
                            <div className="product-attributes">
                                {renderVariationAttributes()}
                            </div>
                        )}

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
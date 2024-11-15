import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import '../styles/ProductCard.css';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showLoginAlert, setShowLoginAlert] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [updatedPrice, setUpdatedPrice] = useState(product["מחיר רגיל"]);
    const [totalPrice, setTotalPrice] = useState(product["מחיר רגיל"] || 0);

    useEffect(() => {
        if (product && Array.isArray(product.variations) && product.variations.length > 0) {
            const attributeOptions = {};
            const defaultAttributes = {};

            product.variations.forEach((variation) => {
                const attributes = variation.attributes;
                if (attributes && typeof attributes === 'object') {
                    for (const [key, { value }] of Object.entries(attributes)) {
                        if (!attributeOptions[key]) {
                            attributeOptions[key] = new Set();
                        }
                        attributeOptions[key].add(value);
                    }
                }
            });

            Object.entries(attributeOptions).forEach(([attributeName, values]) => {
                defaultAttributes[attributeName] = [...values][0];
            });

            setSelectedAttributes(defaultAttributes);
            calculateTotalPrice(defaultAttributes, selectedQuantity);
        }
    }, [product.variations]);

    const toggleModal = () => {
        setShowModal(!showModal);
        setShowSuccessMessage(false);
    };

    const handleAttributeChange = (attributeName, selectedValue) => {
        setSelectedAttributes((prevSelectedAttributes) => {
            const updatedAttributes = { ...prevSelectedAttributes, [attributeName]: selectedValue };
            calculateTotalPrice(updatedAttributes, selectedQuantity);
            return updatedAttributes;
        });
    };

    const handleQuantityChange = (quantity) => {
        setSelectedQuantity(quantity);
        calculateTotalPrice(selectedAttributes, quantity);
    };

    const calculateTotalPrice = (updatedAttributes, quantity) => {
        let updatedPriceTemp = product["מחיר רגיל"] || 0;

        if (product.variations && product.variations.length > 0) {
            for (const variation of product.variations) {
                const attributes = variation.attributes;
                let match = true;

                for (const [key, selectedValue] of Object.entries(updatedAttributes)) {
                    if (!attributes || !attributes[key] || attributes[key].value !== selectedValue) {
                        match = false;
                        break;
                    }
                }

                if (match) {
                    for (const attribute of Object.values(attributes || {})) {
                        if (attribute && attribute.price) {
                            updatedPriceTemp += Number(attribute.price);
                        }
                    }
                    break;
                }
            }
        }
        setUpdatedPrice(updatedPriceTemp)
        setTotalPrice(updatedPrice * quantity);
    };

    const renderVariationAttributes = () => {
        if (product.variations && product.variations.length > 0) {
            const attributeOptions = {};

            product.variations.forEach((variation) => {
                const attributes = variation.attributes;
                if (attributes && typeof attributes === 'object') {
                    for (const [key, { value }] of Object.entries(attributes)) {
                        if (!attributeOptions[key]) {
                            attributeOptions[key] = new Set();
                        }
                        attributeOptions[key].add(value);
                    }
                }
            });

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

    const handleAddToCart = () => {
        const user = auth.currentUser;
        if (!user) {
            setShowLoginAlert(true);
            setTimeout(() => setShowLoginAlert(false), 3000);
            return;
        }
        console.log(totalPrice, "מחיר בכרטיס מוצר");

        dispatch(addToCart({ ...product, price: totalPrice, unitPrice: updatedPrice, quantity: selectedQuantity, packageSize: selectedQuantity }));
        setShowModal(false);
        setShowSuccessMessage(true);

        setTimeout(() => {
            setShowSuccessMessage(false);
        }, 3000);
    };

    return (
        <>
            <div className="product-card" onClick={toggleModal}>
                <img src={product.תמונות} alt={product.שם} className="product-card-image" />
                <h3 className="product-card-title">{product.שם}</h3>
                <p className="product-card-description">
                    {product["תיאור קצר"] ? product["תיאור קצר"] : product["תיאור"]}
                </p>
                <div className="product-card-footer">
                    <span className="product-card-price">{`₪${Number(product["מחיר רגיל"]).toFixed(2)}`}</span>
                </div>
            </div>

            {showModal && (
                <div className="modal" onClick={(e) => e.target.className === 'modal' && toggleModal()}>
                    <div className="modal-content">
                        <span className="close" onClick={toggleModal}>&times;</span>
                        <h2>{product.שם}</h2>
                        <img src={product.תמונות} alt={product.שם} className="modal-image" />
                        <p>{product["תיאור"] ? product["תיאור"] : product["תיאור קצר"]}</p>
                        <p>{`מחיר: ₪${updatedPrice.toFixed(2) * selectedQuantity}`}</p>

                        {product.סוג === 'variable' && (
                            <div className="product-attributes">
                                {renderVariationAttributes()}
                            </div>
                        )}

                        {product.quantities && product.quantities.length > 0 && (
                            <div className="quantity-options">
                                <strong>בחר כמות:</strong>
                                <div className="quantity-row">
                                    {product.quantities.map((quantity, index) => (
                                        <label key={index} style={{ marginRight: '10px' }}>
                                            <input
                                                type="radio"
                                                name="quantity"
                                                value={quantity}
                                                checked={selectedQuantity === quantity}
                                                onChange={() => handleQuantityChange(quantity)}

                                            />
                                            {quantity}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            className="product-card-button"
                            onClick={handleAddToCart}
                        >
                            הוסף לעגלה
                        </button>
                        {showLoginAlert && (
                            <div className="alert alert-red">
                                אנא התחבר כדי להוסיף מוצרים לעגלה
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showSuccessMessage && (
                <div className="success-message">
                    <span>✔ המוצר התווסף בהצלחה לעגלה!</span>
                    <button onClick={() => setShowSuccessMessage(false)} className="close-button">×</button>
                </div>
            )}
        </>
    );
};

export default ProductCard;
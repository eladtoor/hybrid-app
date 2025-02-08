import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import '../styles/ProductCard.css';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user); // Get user data from Redux



    const [showLoginAlert, setShowLoginAlert] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [updatedPrice, setUpdatedPrice] = useState(product["מחיר רגיל"] || 0);
    const [totalPrice, setTotalPrice] = useState(product["מחיר רגיל"] || 0);
    const [originalPrice, setOriginalPrice] = useState(product["מחיר רגיל"] || 0);
    const [hasDiscount, setHasDiscount] = useState(false); // New state to check if the product has a discount
    const [disableAddToCart, setDisableAddToCart] = useState(product.quantities && product.quantities.length > 0);
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [craneUnload, setCraneUnload] = useState(null);
    const [comment, setComment] = useState("");






    const materialGroupTranslations = {
        'Colors and Accessories': 'צבעים ומוצרים נלווים',
        'Powders': 'אבקות (דבקים וטייח)',
        'Gypsum and Tracks': 'גבס ומסלולים'
    };



    const productMaterialGroup = product.materialGroup ? materialGroupTranslations[product.materialGroup] || product.materialGroup : null;

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
        } else {
            calculateTotalPrice({}, 1);
        }
    }, [product]);

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
        setDisableAddToCart(false);  // Enable the "Add to Cart" button when a quantity is selected
        calculateTotalPrice(selectedAttributes, quantity);
    };


    const calculateTotalPrice = (updatedAttributes, quantity) => {
        let updatedPriceTemp = product["מחיר רגיל"] || 0;

        const discountInfo = user?.productDiscounts?.find((discount) => discount.productId === product._id);
        const discount = discountInfo ? parseFloat(discountInfo.discount) : 0;
        setDiscountPercentage(discount);
        setHasDiscount(discount > 0); // Check if there is a discount


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

        const finalPrice = updatedPriceTemp - (updatedPriceTemp * discount) / 100;
        setOriginalPrice(updatedPriceTemp);
        setUpdatedPrice(finalPrice);
        setTotalPrice(finalPrice * quantity);
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
        if (!auth.currentUser) {
            setShowLoginAlert(true);
            setTimeout(() => setShowLoginAlert(false), 3000);
            return;
        }

        // Prepare cart item with crane unloading selection
        const hasComment = product.allowComments && comment.trim() !== "";

        // ✅ Generate a unique ID ONLY if there is a comment
        const uniqueId = hasComment ? `${product._id}-${Date.now()}` : product._id;

        const cartItem = {
            ...product,
            cartItemId: uniqueId, // ✅ Unique ID if comment exists, otherwise normal ID
            price: totalPrice,
            unitPrice: updatedPrice,
            quantity: selectedQuantity,
            packageSize: selectedQuantity,
            craneUnload: product.materialGroup === "Gypsum and Tracks" ? craneUnload : null,
            comment: hasComment ? comment : "", // ✅ Keep user comment if exists
        };

        console.log("Adding to cart:", cartItem); // 👈 Debugging

        dispatch(addToCart(cartItem));

        setComment("");
        setShowModal(false);
        setShowSuccessMessage(true);

        setTimeout(() => {
            setShowSuccessMessage(false);
        }, 3000);
    };



    const handleCraneUnloadChange = (value) => {
        console.log(value);

        setCraneUnload(value);
    };


    return (
        <>
            <div className="product-card" onClick={toggleModal}>
                {hasDiscount && (
                    <div className="discount-badge">
                        {`${discountPercentage}% הנחה`}
                    </div>
                )}
                {productMaterialGroup && (
                    <div className="material-group-icon">
                        {productMaterialGroup}
                    </div>
                )}
                <img src={product.תמונות} alt={product.שם} className="product-card-image" />
                <h3 className="product-card-title">{product.שם}</h3>
                <p className="product-card-description">
                    {product["תיאור קצר"] ? product["תיאור קצר"] : product["תיאור"]}
                </p>
                <div className="product-card-footer">
                    <span className="product-card-link">הצג עוד</span>
                </div>
            </div>

            {showModal && (
                <div className="modal" onClick={(e) => e.target.className === 'modal' && toggleModal()}>
                    <div className="modal-content">
                        {productMaterialGroup && (
                            <div className="material-group-icon-modal">
                                {productMaterialGroup}
                            </div>
                        )}
                        <span className="close" onClick={toggleModal}>&times;</span>
                        <h2 className='modal-title'>{product.שם}</h2>
                        <img src={product.תמונות} alt={product.שם} className="modal-image" />
                        <p>{product["תיאור"] ? product["תיאור"] : product["תיאור קצר"]}</p>

                        {productMaterialGroup && (
                            <div className="material-group-badge-modal">
                                {productMaterialGroup}
                            </div>
                        )}

                        <div className="price-section">
                            {hasDiscount ? (
                                <>
                                    <p className="original-price">
                                        <span style={{ textDecoration: 'line-through', color: '#a0a0a0' }}>
                                            ₪{(originalPrice * selectedQuantity).toFixed(2)}
                                        </span>
                                    </p>
                                    <p className="discounted-price">
                                        <strong style={{ fontSize: '1.5rem', color: '#ff4d4f' }}>
                                            ₪{totalPrice.toFixed(2)}
                                        </strong>
                                    </p>
                                </>
                            ) : (
                                <p className="discounted-price">
                                    <strong style={{ fontSize: '1.5rem', color: '#000' }}>
                                        ₪{totalPrice.toFixed(2)}
                                    </strong>
                                </p>
                            )}
                        </div>

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
                        {product.materialGroup === "Gypsum and Tracks" && (
                            <div className="crane-unload-section">
                                <strong>האם נדרשת פריקת מנוף?</strong>
                                <div className="crane-options">
                                    <label className={craneUnload === "כן" ? "selected" : ""}>
                                        <input
                                            type="radio"
                                            name="craneUnload"
                                            value="כן"
                                            checked={craneUnload === "כן"}
                                            onChange={() => handleCraneUnloadChange("כן")}
                                        />
                                        כן
                                    </label>
                                    <label className={craneUnload === "לא" ? "selected" : ""}>
                                        <input
                                            type="radio"
                                            name="craneUnload"
                                            value="לא"
                                            checked={craneUnload === "לא"}
                                            onChange={() => handleCraneUnloadChange("לא")}
                                        />
                                        לא
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Show comment input only if allowComments is true */}
                        {product.allowComments && (
                            <div className="comment-section">
                                <label>הערות:</label>
                                <input
                                    type="text"
                                    placeholder="הזן הערה למוצר זה..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="comment-input"
                                />
                            </div>
                        )}



                        <button
                            className="product-card-button"
                            onClick={handleAddToCart}
                            disabled={disableAddToCart || (product.materialGroup === "Gypsum and Tracks" && craneUnload === null)}
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

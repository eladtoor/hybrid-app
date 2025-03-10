import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
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
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 cursor-pointer p-4" onClick={toggleModal}>
                {hasDiscount && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {`${discountPercentage}% הנחה`}
                    </div>
                )}
                {productMaterialGroup && (
                    <div className="absolute top-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
                        {productMaterialGroup}
                    </div>
                )}
                <img src={product.תמונות} alt={product.שם} className="w-full h-48 object-cover rounded-lg" />
                <h3 className="text-lg font-semibold text-gray-800 text-center mt-2">{product.שם}</h3>
                <p className="text-sm text-gray-600 text-center">{product["תיאור קצר"] ? product["תיאור קצר"] : product["תיאור"]}</p>
                <div className="text-center mt-2">
                    <span className="text-blue-600 font-semibold cursor-pointer">הצג עוד</span>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={(e) => e.target.className.includes('bg-black') && toggleModal()}>
                    <div className="bg-white w-11/12 max-w-md p-6 rounded-lg shadow-lg relative">
                        <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl" onClick={toggleModal}>&times;</button>
                        <h2 className="text-2xl font-bold text-gray-800 text-center">{product.שם}</h2>
                        <img src={product.תמונות} alt={product.שם} className="w-32 h-32 object-cover rounded-full mx-auto mt-4" />
                        <p className="text-center text-gray-600 mt-2">{product["תיאור"] ? product["תיאור"] : product["תיאור קצר"]}</p>

                        <div className="mt-4 text-center">
                            {hasDiscount ? (
                                <>
                                    <p className="text-gray-500 line-through">₪{(originalPrice * selectedQuantity).toFixed(2)}</p>
                                    <p className="text-2xl font-bold text-red-500">₪{totalPrice.toFixed(2)}</p>
                                </>
                            ) : (
                                <p className="text-2xl font-bold text-gray-900">₪{totalPrice.toFixed(2)}</p>
                            )}
                        </div>

                        {product.סוג === 'variable' && (
                            <div className="mt-4">
                                <h3 className="font-semibold text-gray-800">בחר מאפיין:</h3>
                                {renderVariationAttributes()}
                            </div>
                        )}

                        {product.quantities && product.quantities.length > 0 && (
                            <div className="mt-4">
                                <h3 className="font-semibold text-gray-800">בחר כמות:</h3>
                                <div className="flex gap-2 mt-2">
                                    {product.quantities.map((quantity, index) => (
                                        <label key={index} className={`px-4 py-2 border rounded-md cursor-pointer transition ${selectedQuantity === quantity ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                                            <input type="radio" name="quantity" value={quantity} checked={selectedQuantity === quantity} onChange={() => handleQuantityChange(quantity)} className="hidden" />
                                            {quantity}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {product.materialGroup === "Gypsum and Tracks" && (
                            <div className="mt-4">
                                <h3 className="font-semibold text-gray-800">האם נדרשת פריקת מנוף?</h3>
                                <div className="flex gap-4 mt-2">
                                    <label className={`px-4 py-2 border rounded-md cursor-pointer transition ${craneUnload === "כן" ? 'bg-green-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                                        <input type="radio" name="craneUnload" value="כן" checked={craneUnload === "כן"} onChange={() => setCraneUnload("כן")} className="hidden" />
                                        כן
                                    </label>
                                    <label className={`px-4 py-2 border rounded-md cursor-pointer transition ${craneUnload === "לא" ? 'bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                                        <input type="radio" name="craneUnload" value="לא" checked={craneUnload === "לא"} onChange={() => setCraneUnload("לא")} className="hidden" />
                                        לא
                                    </label>
                                </div>
                            </div>
                        )}

                        {product.allowComments && (
                            <div className="mt-4">
                                <label className="font-semibold text-gray-800">הערות:</label>
                                <input type="text" placeholder="הזן הערה למוצר..." value={comment} onChange={(e) => setComment(e.target.value)} className="w-full p-2 border rounded-md mt-2" />
                            </div>
                        )}

                        <button className="mt-6 w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 transition" onClick={handleAddToCart} disabled={disableAddToCart || (product.materialGroup === "Gypsum and Tracks" && craneUnload === null)}>הוסף לעגלה</button>

                        {showLoginAlert && (
                            <div className="mt-4 text-center text-red-500 font-semibold">
                                אנא התחבר כדי להוסיף מוצרים לעגלה.
                            </div>
                        )}

                        {showSuccessMessage && (
                            <div className="success-message">
                                <span>✔ המוצר התווסף בהצלחה לעגלה!</span>
                                <button onClick={() => setShowSuccessMessage(false)} className="close-button">×</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );


};

export default ProductCard;

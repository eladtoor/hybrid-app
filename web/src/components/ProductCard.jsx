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
    const [selectedQuantity, setSelectedQuantity] = useState(
        product.quantities && product.quantities.length > 0 ? null : 1
    );
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
                <div key={index} className="mt-4 w-full">
                    {/* שים את הכותרת לבד בשורה */}
                    <h3 className="font-semibold text-gray-800 mb-2 w-full">{attributeName}:</h3>

                    {/* ערכים של המאפיין בשורה נפרדת */}
                    <div className="flex gap-3 flex-wrap w-full">
                        {[...values].map((value) => (
                            <label
                                key={value}
                                className={`px-4 py-2 border rounded-md cursor-pointer transition-all duration-300
                                    ${selectedAttributes[attributeName] === value
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-gray-100 hover:bg-gray-200'}`}
                            >
                                <input
                                    type="radio"
                                    name={attributeName}
                                    value={value}
                                    checked={selectedAttributes[attributeName] === value}
                                    onChange={() => handleAttributeChange(attributeName, value)}
                                    className="hidden"
                                />
                                {value}
                            </label>
                        ))}
                    </div>
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

        if (product.quantities && product.quantities.length > 0 && !selectedQuantity) {
            alert("אנא בחר כמות לפני הוספה לעגלה.");
            return;
        }

        if (product.materialGroup === "Gypsum and Tracks" && craneUnload === null) {
            alert("אנא בחר האם דרושה פריקת מנוף.");
            return;
        }

        const hasComment = product.allowComments && comment.trim() !== "";

        let uniqueId = product._id;

        if (product.variations && Object.keys(selectedAttributes).length > 0) {
            const attributesString = Object.entries(selectedAttributes)
                .map(([key, value]) => `${key}:${value}`)
                .join("|");
            uniqueId += `|${attributesString}`;
        }

        if (hasComment) {
            uniqueId += `|comment:${comment}`;
        }

        // ✅ שם מוצר כולל מאפיינים
        const selectedAttributeString = Object.entries(selectedAttributes)
            .map(([key, value]) => value)
            .join(" - ");

        const fullProductName = selectedAttributeString
            ? `${product.שם} - ${selectedAttributeString}`
            : product.שם;

        // ✅ בניית selectedAttributes עם מחירים
        const enrichedSelectedAttributes = {};
        console.log(product);

        if (product.variations && Array.isArray(product.variations)) {
            for (const variation of product.variations) {
                const match = Object.entries(selectedAttributes).every(([key, value]) => {
                    return variation.attributes?.[key]?.value === value;
                });

                if (match) {
                    Object.entries(selectedAttributes).forEach(([key, value]) => {
                        const price = parseFloat(variation.attributes?.[key]?.price || 0);
                        enrichedSelectedAttributes[key] = {
                            value,
                            price
                        };
                    });
                    break; // מצאנו וריאציה מתאימה
                }
            }
        } else {
            // מוצר בלי וריאציות – שמור מחיר אפס
            Object.entries(selectedAttributes).forEach(([key, value]) => {
                enrichedSelectedAttributes[key] = { value, price: 0 };
            });
        }

        const cleanCartItem = {
            _id: product._id,
            sku: product[`מק"ט`],
            name: fullProductName,
            baseName: product.שם,
            cartItemId: uniqueId,
            quantity: selectedQuantity,
            price: totalPrice,
            unitPrice: updatedPrice,
            packageSize: selectedQuantity,
            selectedAttributes: enrichedSelectedAttributes, // ✅ כולל מחיר בפנים
            comment: hasComment ? comment : "",
            image: product.תמונות,
            craneUnload: product.materialGroup === "Gypsum and Tracks" ? craneUnload : null,
            quantities: product.quantities || [], // ✅ אם קיימות
        };

        console.log("🧼 Adding clean cart item:", cleanCartItem);

        dispatch(addToCart(cleanCartItem));

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
            <div
                className="relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer p-3 flex flex-col w-60"
                onClick={toggleModal}
            >
                {/* הנחה */}
                {hasDiscount && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                        {`${discountPercentage}% הנחה`}
                    </div>
                )}

                {/* קבוצת חומר */}
                {productMaterialGroup && (
                    <div className="absolute top-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-full shadow-md">
                        {productMaterialGroup}
                    </div>
                )}

                {/* תמונה */}
                <div className="w-full h-40 bg-gray-100 flex justify-center items-center rounded-md overflow-hidden">
                    <img
                        src={product.תמונות}
                        alt={product.שם}
                        className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
                    />
                </div>

                {/* שם מוצר */}
                <h3 className="text-md font-medium text-gray-900 text-center mt-2 truncate">
                    {product.שם}
                </h3>

                {/* תיאור מוצר */}
                <p className="text-sm text-gray-500 text-center line-clamp-2 mt-1">
                    {product["תיאור קצר"] ? product["תיאור קצר"] : product["תיאור"]}
                </p>

                {/* קישור לפרטים נוספים */}
                <div className="text-center mt-2">
                    <span className="text-blue-600 font-medium cursor-pointer hover:underline">
                        הצג עוד
                    </span>
                </div>
            </div>

            {showModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4"
                    onClick={(e) =>
                        e.target.className.includes('bg-black') && toggleModal()
                    }
                >
                    <div className="bg-white w-11/12 max-w-md p-6 rounded-lg shadow-lg relative max-h-[90vh] overflow-y-auto z-[1100]">
                        {/* כפתור סגירה */}
                        <button
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl"
                            onClick={toggleModal}
                        >
                            &times;
                        </button>

                        {/* תוכן המודל */}
                        <h2 className="text-2xl font-bold text-gray-800 text-center">
                            {product.שם}
                        </h2>
                        <img
                            src={product.תמונות}
                            alt={product.שם}
                            className="w-32 h-32 object-cover rounded-full mx-auto mt-4"
                        />
                        <p className="text-center text-gray-600 mt-2">
                            {product["תיאור"] ? product["תיאור"] : product["תיאור קצר"]}
                        </p>

                        {/* מחיר */}
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

                        {/* מאפיינים */}
                        {product.סוג === 'variable' && (
                            <div className="mt-4">
                                <h3 className="font-semibold text-gray-800 text-center mb-2">בחר מאפיין:</h3>
                                <div className="flex flex-wrap justify-center gap-3">
                                    {renderVariationAttributes()}
                                </div>
                            </div>
                        )}

                        {/* כמות */}
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

                        {/* ✅ הצגת אפשרות פריקת מנוף אם המוצר מקטגוריית "גבס ומסלולים" */}
                        {product.materialGroup === "Gypsum and Tracks" && (
                            <div className="mt-4">
                                <h3 className="font-semibold text-gray-800">פריקת מנוף:</h3>
                                <div className="flex gap-2 mt-2">
                                    <label className={`px-4 py-2 border rounded-md cursor-pointer transition ${craneUnload === true ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                                        <input type="radio" name="craneUnload" value="true" checked={craneUnload === true} onChange={() => handleCraneUnloadChange(true)} className="hidden" />
                                        כן
                                    </label>
                                    <label className={`px-4 py-2 border rounded-md cursor-pointer transition ${craneUnload === false ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                                        <input type="radio" name="craneUnload" value="false" checked={craneUnload === false} onChange={() => handleCraneUnloadChange(false)} className="hidden" />
                                        לא
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* הערות */}
                        {product.allowComments && (
                            <div className="mt-4">
                                <label className="font-semibold text-gray-800">הערות:</label>
                                <input type="text" placeholder="הזן הערה למוצר..." value={comment} onChange={(e) => setComment(e.target.value)} className="w-full p-2 border rounded-md mt-2" />
                            </div>
                        )}

                        {/* כפתור הוספה לעגלה */}
                        <button className="mt-6 w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 transition" onClick={handleAddToCart} >
                            הוסף לעגלה
                        </button>
                    </div>
                </div >
            )}



        </>
    );


};

export default ProductCard;

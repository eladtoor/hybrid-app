import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import '../styles/AdminPanel.css';
import { createProduct, deleteProduct, fetchProducts, updateProduct, updateProductsList, listenForProductUpdates } from '../redux/actions/productActions';
import {
    generateCombinations,
    fetchCategories,
    handleSearch,
    handleMainCategoryChange,
    handleSubCategoryChange,
    handleInputChange,
    handleRadioChange,
    handleAttributeChange,
    handleAttributeValueChange,
    handleAddAttribute,
    handleAddAttributeValue
} from '../utils/adminPanelUtils';





import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import CategoryImageManager from "../components/CategoryImageManager";




const initialProductState = {
    מזהה: '',
    סוג: 'simple',
    'מק"ט': '',
    שם: '',
    'תיאור קצר': '',
    תיאור: '',
    'מחיר מבצע': '',
    'מחיר רגיל': '',
    קטגוריות: [],
    תמונות: '',
    materialGroup: '',
    variations: [],
    attributes: [{ name: '', values: [{ value: '', price: '' }] }],
    quantities: [],
    allowComments: false,
};

const AdminPanel = () => {

    const dispatch = useDispatch();

    const products = useSelector((state) => state.products.products);
    const categories = useSelector((state) => state.categories);

    const [organizedCategories, setCategoriesOrganized] = useState([]);
    const [selectedMainCategories, setSelectedMainCategories] = useState([]);
    const [selectedSubCategories, setSelectedSubCategories] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newProduct, setNewProduct] = useState(initialProductState);

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [quantityEnabled, setQuantityEnabled] = useState(false);
    const [quantityInput, setQuantityInput] = useState('');
    const [materialGroups, setMaterialGroups] = useState([]);
    const [editedPrices, setEditedPrices] = useState({});

    const [editedTransportPrices, setEditedTransportPrices] = useState({});
    const [loading, setLoading] = useState(false);
    const socketRef = useRef(null);
    const [carouselImageUrl, setCarouselImageUrl] = useState("");
    const [carouselFile, setCarouselFile] = useState(null);
    const [siteStats, setSiteStats] = useState({
        clients: 0,
        supplyPoints: 0,
        onlineUsers: 0,
        lastOrderMinutes: 0
    });

    useEffect(() => {
        const fetchSiteStats = async () => {
            try {
                const response = await fetch('/api/site-stats');
                const data = await response.json();
                setSiteStats(data);
            } catch (error) {
                console.error('Error fetching site stats:', error);
            }
        };

        fetchSiteStats();
    }, []);





    useEffect(() => {
        dispatch(fetchProducts()); // ✅ Fetch products on mount
        dispatch(listenForProductUpdates()); // ✅ Start listening for WebSocket updates
    }, [dispatch]);

    useEffect(() => {
        setCategoriesOrganized(fetchCategories(categories));
    }, [categories]);

    useEffect(() => {
        setFilteredProducts(handleSearch(searchQuery, products));
    }, [searchQuery, products]);


    // Fetch material group settings
    useEffect(() => {
        const fetchMaterialGroups = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/materialGroups');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                // Set the fetched material groups to state
                setMaterialGroups(data);

                // Initialize state for editing both minPrice and transportationPrice
                const initialPrices = {};
                const initialTransportPrices = {};
                data.forEach((group) => {
                    initialPrices[group.groupName] = group.minPrice;
                    initialTransportPrices[group.groupName] = group.transportationPrice;
                });

                setEditedPrices(initialPrices);
                setEditedTransportPrices(initialTransportPrices);
            } catch (error) {
                console.error('Error fetching material groups:', error);
            }
            setLoading(false);
        };

        fetchMaterialGroups();
    }, []);
    const optimizeCarouselImageUrl = (url) => {
        if (!url.includes("/upload/")) return url;
        return url.replace("/upload/", "/upload/w_1920,h_400,c_fill,q_auto,f_auto/");
    };

    const handleUploadCarouselImage = async () => {
        if (!carouselFile) return alert("אנא בחר תמונה");

        const formData = new FormData();
        formData.append("file", carouselFile);
        formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

        try {
            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await res.json();
            if (data.secure_url) {
                const optimizedUrl = optimizeCarouselImageUrl(data.secure_url);
                await addDoc(collection(db, "carouselImages"), { url: optimizedUrl });

                alert("התמונה נוספה בהצלחה!");
                setCarouselFile(null);
            } else {
                throw new Error("העלאה נכשלה");
            }
        } catch (error) {
            console.error("שגיאה בהעלאה ל-Cloudinary:", error);
            alert("שגיאה בהעלאה");
        }
    };

    const handleDeleteAllCarouselImages = async () => {
        const confirmed = window.confirm("האם אתה בטוח שברצונך למחוק את כל התמונות מהקרוסלה?");
        if (!confirmed) return;

        try {
            const querySnapshot = await getDocs(collection(db, "carouselImages"));
            const deletePromises = querySnapshot.docs.map((docSnap) =>
                deleteDoc(doc(db, "carouselImages", docSnap.id))
            );
            await Promise.all(deletePromises);
            alert("כל התמונות נמחקו בהצלחה!");
        } catch (error) {
            console.error("שגיאה במחיקת תמונות:", error);
            alert("אירעה שגיאה בעת המחיקה.");
        }
    };







    const handlePriceChange = (groupName, key, value) => {
        setEditedPrices((prevPrices) => ({
            ...prevPrices,
            [groupName]: {
                ...prevPrices[groupName],
                [key]: value,
            },
        }));
    };






    const handleSaveChanges = async () => {
        try {
            const updates = materialGroups.map(async (group) => {
                const updatedValues = editedPrices[group.groupName] || {};
                const minPrice = updatedValues.minPrice ?? group.minPrice; // Use edited or original minPrice
                const transportationPrice =
                    updatedValues.transportationPrice ?? group.transportationPrice; // Use edited or original transportationPrice

                const response = await fetch('/api/materialGroups', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        groupName: group.groupName,
                        minPrice,
                        transportationPrice,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`Failed to update ${group.groupName}`);
                }

                return response.json();
            });

            const updatedGroups = await Promise.all(updates);
            setMaterialGroups((prevGroups) =>
                prevGroups.map((group) =>
                    updatedGroups.find((updated) => updated.groupName === group.groupName) || group
                )
            );
            alert('Prices updated successfully!');
        } catch (error) {
            console.error('Error saving changes:', error);
            alert('Failed to save changes.');
        }
    };






    const handleSubmit = (e) => {
        e.preventDefault();

        // בדיקה אם המשתמש סימן לפחות קטגוריה ראשית אחת
        if (selectedMainCategories.length === 0) {
            alert("אנא סמן לפחות קטגוריה ראשית אחת.");
            return;
        }

        const selectedCategories = selectedMainCategories.map((mainCategoryName) => ({
            mainCategory: mainCategoryName,
            subCategories: selectedSubCategories[mainCategoryName] || []
        }));

        let updatedProduct = { ...newProduct, קטגוריות: selectedCategories, allowComments: newProduct.allowComments, quantities: [...newProduct.quantities].sort((a, b) => a - b) };
        const categoriesString = updatedProduct.קטגוריות.map(category => {
            const mainCategory = category.mainCategory;
            const subCategories = category.subCategories;
            return subCategories.length > 0
                ? subCategories.map(sub => `${mainCategory} > ${sub}`).join(', ')
                : mainCategory;
        }).join(', ');

        updatedProduct.קטגוריות = categoriesString;

        const isDigitalCatalog = updatedProduct.קטגוריות.includes("קטלוגים דיגיטלים להורדה");

        if (isDigitalCatalog) {
            updatedProduct.materialGroup = null;
            updatedProduct.סוג = 'simple';
            updatedProduct.quantities = [];
            updatedProduct.allowComments = false;
            updatedProduct['מחיר רגיל'] = 0;
            updatedProduct['מחיר מבצע'] = 0;
            updatedProduct.variations = [];
            updatedProduct.attributes = [];
        }


        if (Number(updatedProduct['מחיר מבצע']) === 0 || !updatedProduct['מחיר מבצע']) {
            delete updatedProduct['מחיר מבצע'];
        }

        // אם סוג המוצר הוא "סימפל", הסר את כל המאפיינים המיוחדים
        if (updatedProduct.סוג === 'simple') {
            updatedProduct.variations = [];
            updatedProduct.attributes = [];
        } else if (updatedProduct.סוג === 'variable') {
            const attributeNames = updatedProduct.attributes.map((attr) => attr.name);
            const attributeValues = updatedProduct.attributes.map((attr) => attr.values);
            const variations = generateCombinations(attributeValues).map((combination, index) => {
                const attributes = {};
                let totalPrice = 0;

                combination.forEach((valueObj, i) => {
                    attributes[`${attributeNames[i]}`] = {
                        value: valueObj.value,
                        price: valueObj.price
                    };
                    totalPrice += Number(valueObj.price);
                });

                return {
                    מזהה: Math.floor(Math.random() * 100000),
                    סוג: 'variation',
                    שם: `${updatedProduct.שם} - ${combination.map((val) => val.value).join(', ')}`,
                    מחיר: totalPrice,
                    'תיאור קצר': updatedProduct['תיאור קצר'],
                    attributes
                };
            });

            updatedProduct = { ...updatedProduct, variations };
        }

        if (isEditing) {
            dispatch(updateProduct(updatedProduct));
            setIsEditing(false);
        } else {
            dispatch(createProduct(updatedProduct));
        }

        setNewProduct(initialProductState);
        setShowForm(false);
    };

    const handleDelete = (productId) => {
        if (window.confirm('האם אתה בטוח שברצונך למחוק את המוצר?')) {
            dispatch(deleteProduct(productId));
        }
    };

    const handleAddQuantity = () => {
        if (quantityInput && !isNaN(quantityInput) && Number(quantityInput) > 0) { // בדיקה אם המספר חיובית
            setNewProduct(prevState => ({
                ...prevState,
                quantities: [...prevState.quantities, Number(quantityInput)]
            }));
            setQuantityInput('');
        } else {
            alert("אנא הזן כמות חיובית בלבד.");
        }
    };

    const openEditModal = (product) => {
        const productToEdit = { ...product };
        productToEdit.materialGroup = productToEdit.materialGroup || ''; // Ensure material group is set

        // ודא שמאפיינים קיימים ותואמים למבנה הדרוש
        if (productToEdit.סוג === 'variable') {
            if (!Array.isArray(productToEdit.attributes) || productToEdit.attributes.length === 0) {
                // נבנה attributes מתוך variations
                const attributeMap = {};

                productToEdit.variations?.forEach((variation) => {
                    const attrs = variation.attributes;
                    for (const [attrName, { value, price }] of Object.entries(attrs)) {
                        if (!attributeMap[attrName]) {
                            attributeMap[attrName] = new Map();
                        }
                        attributeMap[attrName].set(value, price);
                    }
                });

                // בניית attributes במבנה הדרוש
                productToEdit.attributes = Object.entries(attributeMap).map(([name, valueMap]) => ({
                    name,
                    values: Array.from(valueMap.entries()).map(([value, price]) => ({
                        value,
                        price: Number(price),
                    }))
                }));
            } else {
                // Normalize existing attributes
                productToEdit.attributes = productToEdit.attributes.map((attr) => ({
                    name: attr.name || '',
                    values: Array.isArray(attr.values)
                        ? attr.values.map((val) => ({
                            value: val?.value || '',
                            price: val?.price || 0,
                        }))
                        : [{ value: '', price: 0 }],
                }));
            }
        }


        // אם הקטגוריות אינן מערך, המרתן למערך
        const categoriesArray = Array.isArray(product.קטגוריות)
            ? product.קטגוריות
            : product.קטגוריות.split(', ').map(cat => {
                const [mainCategory, ...subCategories] = cat.split(' > ');
                return {
                    mainCategory: mainCategory.trim(),
                    subCategories: subCategories.length ? [subCategories.join(' > ').trim()] : [],
                };
            });

        // הגדרת קטגוריות ייחודיות ללא כפילויות
        const uniqueCategories = {};
        categoriesArray.forEach(cat => {
            if (!uniqueCategories[cat.mainCategory]) {
                uniqueCategories[cat.mainCategory] = new Set();
            }
            cat.subCategories.forEach(subCategory => uniqueCategories[cat.mainCategory].add(subCategory));
        });

        // שמירת הקטגוריות הראשיות ותתי-הקטגוריות המיוחדות במצב
        setSelectedMainCategories(Object.keys(uniqueCategories));
        const subCategories = {};
        Object.entries(uniqueCategories).forEach(([mainCategory, subCategorySet]) => {
            subCategories[mainCategory] = Array.from(subCategorySet);
        });
        setSelectedSubCategories(subCategories);

        setNewProduct(productToEdit);
        setQuantityEnabled(productToEdit.quantities && productToEdit.quantities.length > 0); // הפעלת אופציית כמות אם יש
        setIsEditing(true);
        setShowForm(true);
    };

    const handleStatsChange = (e) => {
        const { name, value } = e.target;
        setSiteStats((prev) => ({
            ...prev,
            [name]: Number(value)
        }));
    };

    const handleSaveStats = async () => {
        try {
            const response = await fetch('/api/site-stats', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(siteStats)
            });

            if (!response.ok) throw new Error('Failed to update site stats');
            alert('Site stats updated successfully!');
        } catch (error) {
            console.error('Error updating site stats:', error);
            alert('Failed to update site stats');
        }
    };



    return (
        <div className="admin-panel p-32">
            <h1 className='text-4xl inline-block font-bold text-gray-900 mt-6 pr-4 border-r-4 border-primary'>פאנל ניהול</h1>

            {/* ניהול סטטיסטיקות דף הבית */}
            <div className="border-t pt-6 mt-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-4">ניהול סטטיסטיקות דף הבית</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label>
                        לקוחות מרוצים:
                        <input
                            type="number"
                            name="clients"
                            value={siteStats.clients}
                            onChange={handleStatsChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </label>
                    <label>
                        נקודות אספקה:
                        <input
                            type="number"
                            name="supplyPoints"
                            value={siteStats.supplyPoints}
                            onChange={handleStatsChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </label>
                    <label>
                        מחוברים כרגע:
                        <input
                            type="number"
                            name="onlineUsers"
                            value={siteStats.onlineUsers}
                            onChange={handleStatsChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </label>
                    <label>
                        דקות מההזמנה האחרונה:
                        <input
                            type="number"
                            name="lastOrderMinutes"
                            value={siteStats.lastOrderMinutes}
                            onChange={handleStatsChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </label>
                </div>
                <button
                    onClick={handleSaveStats}
                    className="w-full sm:w-auto btn-primary mt-4 text-lg"
                >
                    שמור סטטיסטיקות
                </button>
            </div>

            <div>
                <h2 className="text-xl font-bold mb-4">ניהול תמונות קטגוריות</h2>
                <CategoryImageManager organizedCategories={organizedCategories} />

            </div>

            <h2 className="text-xl sm:text-2xl font-bold mb-4">ניהול מחירי מינימום לקבוצות חומרים</h2>
            {loading ? (
                <p>טוען...</p>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-lg shadow-md text-lg">
                        <table className="min-w-full table-auto text-right border border-gray-300 bg-white">
                            <thead className="bg-orange-100 text-orange-800">
                                <tr>
                                    <th className="px-6 py-3 border-b border-gray-300 font-semibold text-xl">שם הקבוצה</th>
                                    <th className="px-6 py-3 border-b border-gray-300 font-semibold text-xl">מחיר מינימום נוכחי</th>
                                    <th className="px-6 py-3 border-b border-gray-300 font-semibold text-xl">מחיר הובלה</th>
                                    <th className="px-6 py-3 border-b border-gray-300 font-semibold text-xl">עדכן מחיר מינימום ומחיר הובלה</th>
                                </tr>
                            </thead>
                            <tbody>
                                {materialGroups.map((group, index) => (
                                    <tr key={group.groupName} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                        <td className="px-6 py-4 border-b border-gray-200">
                                            {group.groupName === 'Colors and Accessories' && 'צבעים ומוצרים נלווים'}
                                            {group.groupName === 'Powders' && 'אבקות (דבקים וטייח)'}
                                            {group.groupName === 'Gypsum and Tracks' && 'גבס ומסלולים'}
                                        </td>
                                        <td className="px-6 py-4 border-b border-gray-200">{group.minPrice}₪</td>
                                        <td className="px-6 py-4 border-b border-gray-200">{group.transportationPrice}₪</td>
                                        <td className="px-6 py-4 border-b border-gray-200 space-y-2">
                                            <input
                                                type="number"
                                                className="w-28 px-2 m-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                                                value={editedPrices[group.groupName]?.minPrice ?? group.minPrice}
                                                onChange={(e) =>
                                                    handlePriceChange(
                                                        group.groupName,
                                                        'minPrice',
                                                        e.target.value === '' ? null : Number(e.target.value)
                                                    )
                                                }
                                            />
                                            <input
                                                type="number"
                                                className="w-28 px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                                                value={editedPrices[group.groupName]?.transportationPrice ?? group.transportationPrice}
                                                onChange={(e) =>
                                                    handlePriceChange(
                                                        group.groupName,
                                                        'transportationPrice',
                                                        e.target.value === '' ? null : Number(e.target.value)
                                                    )
                                                }
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <button
                        onClick={handleSaveChanges}
                        className="admin-button btn-outline mt-4 text-xl "
                    >
                        עדכן מחירים
                    </button>

                </>
            )}
            <div className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-4">הוספת תמונה לקרוסלה</h2>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCarouselFile(e.target.files[0])}
                    className="mb-4"
                />
                <button
                    onClick={handleUploadCarouselImage}
                    className="w-full sm:w-auto btn-primary text-lg"
                >
                    העלה תמונה
                </button>
                <button
                    onClick={handleDeleteAllCarouselImages}
                    className="w-full sm:w-auto btn-outline text-red-600 border-red-600 hover:bg-red-100 mt-2"
                >
                    מחק את כל תמונות הקרוסלה
                </button>
            </div>






            <button
                className="admin-button btn-outline text-xl"
                onClick={() => {
                    setIsEditing(false);
                    setNewProduct(initialProductState);
                    setSelectedMainCategories([]);  // איפוס קטגוריות ראשיות
                    setSelectedSubCategories({});   // איפוס תתי קטגוריות
                    setShowForm(true);
                }}
            >
                הוסף מוצר חדש
            </button>

            <input
                type="text"
                placeholder="חפש לפי מזהה/מק״ט/שם"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-bar search-input hidden md:block"
            />

            {showForm && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close modal-close" onClick={() => setShowForm(false)}>&times;</span>
                        <h2 className='section-title-rtl'>{isEditing ? "ערוך מוצר" : "הוסף מוצר חדש"}</h2>
                        <form onSubmit={handleSubmit}>
                            {/* זיהוי אם קטלוג דיגיטלי */}
                            {(() => {
                                const isDigitalCatalog = newProduct.קטגוריות.includes("קטלוגים דיגיטלים להורדה");

                                return (
                                    <>
                                        {!isDigitalCatalog && (
                                            <>
                                                <label>
                                                    קבוצת חומרים:
                                                    <select
                                                        name="materialGroup"
                                                        value={newProduct.materialGroup || ''}
                                                        onChange={(e) =>
                                                            setNewProduct((prev) => ({
                                                                ...prev,
                                                                materialGroup: e.target.value
                                                            }))
                                                        }
                                                        required={!isDigitalCatalog}
                                                    >
                                                        <option value="">בחר קבוצת חומרים</option>
                                                        <option value="Colors and Accessories">צבעים ומוצרים נלווים</option>
                                                        <option value="Powders">אבקות (דבקים וטייח)</option>
                                                        <option value="Gypsum and Tracks">גבס ומסלולים</option>
                                                    </select>
                                                </label>
                                                <label>
                                                    מזהה:
                                                    <input
                                                        type="text"
                                                        name="מזהה"
                                                        value={newProduct.מזהה}
                                                        onChange={(e) => handleInputChange(e, setNewProduct)}
                                                        required
                                                    />
                                                </label>
                                                <label>
                                                    סוג:
                                                    <div className="radio-group">
                                                        <label>
                                                            <input
                                                                type="radio"
                                                                name="סוג"
                                                                value="simple"
                                                                checked={newProduct.סוג === 'simple'}
                                                                onChange={(e) => handleRadioChange(e, setNewProduct)}
                                                            />
                                                            Simple
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="radio"
                                                                name="סוג"
                                                                value="variable"
                                                                checked={newProduct.סוג === 'variable'}
                                                                onChange={(e) => handleRadioChange(e, setNewProduct)}
                                                            />
                                                            Variable
                                                        </label>
                                                    </div>
                                                </label>

                                                {newProduct.סוג === 'variable' && (
                                                    <>
                                                        <h3>מאפיינים</h3>
                                                        {newProduct.attributes.map((attribute, index) => (
                                                            <div key={index} className="attribute-container">
                                                                <label>
                                                                    שם מאפיין:
                                                                    <input
                                                                        type="text"
                                                                        value={attribute.name}
                                                                        onChange={(e) =>
                                                                            handleAttributeChange(index, 'name', e.target.value, newProduct, setNewProduct)
                                                                        }
                                                                        required
                                                                    />
                                                                </label>

                                                                {attribute.values.map((valueObj, valueIndex) => (
                                                                    <div key={valueIndex} className="attribute-values">
                                                                        <label>
                                                                            ערך מאפיין:
                                                                            <input
                                                                                type="text"
                                                                                value={valueObj.value}
                                                                                onChange={(e) =>
                                                                                    handleAttributeValueChange(index, valueIndex, 'value', e.target.value, newProduct, setNewProduct)
                                                                                }
                                                                                required
                                                                            />
                                                                        </label>
                                                                        <label>
                                                                            מחיר מאפיין:
                                                                            <input
                                                                                type="number"
                                                                                step="0.01"
                                                                                value={valueObj.price}
                                                                                onChange={(e) =>
                                                                                    handleAttributeValueChange(index, valueIndex, 'price', e.target.value, newProduct, setNewProduct)
                                                                                }
                                                                                required
                                                                            />
                                                                        </label>
                                                                    </div>
                                                                ))}

                                                                <div className="attribute-buttons">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleAddAttributeValue(index, newProduct, setNewProduct)}
                                                                    >
                                                                        הוסף ערך מאפיין
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}

                                                        <div className="attribute-buttons">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleAddAttribute(newProduct, setNewProduct)}
                                                            >
                                                                הוסף שם מאפיין
                                                            </button>
                                                        </div>
                                                    </>
                                                )}

                                                <label className='quantity-check'>
                                                    אופציה לכמות
                                                    <input
                                                        type="checkbox"
                                                        checked={quantityEnabled}
                                                        onChange={() => setQuantityEnabled(!quantityEnabled)}
                                                    />
                                                </label>

                                                {quantityEnabled && (
                                                    <div className="quantity-input-section">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            placeholder="הכנס כמות"
                                                            value={quantityInput}
                                                            onChange={(e) => setQuantityInput(e.target.value)}
                                                        />
                                                        <button type="button" onClick={handleAddQuantity}>הוסף כמות</button>

                                                        <div className="quantities-display">
                                                            {newProduct.quantities.join(', ')}
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() => setNewProduct((prevState) => ({ ...prevState, quantities: [] }))}
                                                        >
                                                            איפוס כמות
                                                        </button>
                                                    </div>
                                                )}

                                                <label className='comment-field-checkbox'>
                                                    פתח שדה הערות
                                                    <input
                                                        type="checkbox"
                                                        checked={newProduct.allowComments}
                                                        onChange={() =>
                                                            setNewProduct((prev) => ({
                                                                ...prev,
                                                                allowComments: !prev.allowComments,
                                                            }))
                                                        }
                                                    />
                                                </label>

                                                <label>
                                                    מחיר רגיל:
                                                    <input type="number" name="מחיר רגיל" value={newProduct['מחיר רגיל']} onChange={(e) => handleInputChange(e, setNewProduct)} />
                                                </label>
                                                <label>
                                                    מחיר מבצע:
                                                    <input type="number" name="מחיר מבצע" value={newProduct['מחיר מבצע']} onChange={(e) => handleInputChange(e, setNewProduct)} />
                                                </label>
                                            </>
                                        )}

                                        {/* שדות שתמיד מופיעים */}
                                        <label>
                                            מק"ט:
                                            <input type="text" name='מק"ט' value={newProduct['מק"ט']} onChange={(e) => handleInputChange(e, setNewProduct)} required />
                                        </label>
                                        <label>
                                            שם:
                                            <input type="text" name="שם" value={newProduct.שם} onChange={(e) => handleInputChange(e, setNewProduct)} required />
                                        </label>
                                        <label>
                                            תיאור קצר:
                                            <textarea name="תיאור קצר" value={newProduct['תיאור קצר']} onChange={(e) => handleInputChange(e, setNewProduct)} />
                                        </label>
                                        <label>
                                            תיאור (לינק לקטלוג):
                                            <textarea name="תיאור" value={newProduct.תיאור} onChange={(e) => handleInputChange(e, setNewProduct)} />
                                        </label>
                                        <label>
                                            תמונות:
                                            <input type="text" name="תמונות" value={newProduct.תמונות} onChange={(e) => handleInputChange(e, setNewProduct)} />
                                        </label>

                                        {/* קטגוריות */}
                                        <label>
                                            קטגוריות:
                                            <div className="category-checklist-container">
                                                <div className="main-categories">
                                                    {organizedCategories.map((category, index) => (
                                                        <div key={index}>
                                                            <label htmlFor={`main-${index}`}>{category.categoryName}</label>
                                                            <input
                                                                type="checkbox"
                                                                id={`main-${index}`}
                                                                value={category.categoryName}
                                                                checked={selectedMainCategories.includes(category.categoryName)}
                                                                onChange={() => handleMainCategoryChange(category.categoryName, setSelectedMainCategories, selectedSubCategories, setSelectedSubCategories)}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="sub-category-section">
                                                    {selectedMainCategories.map((mainCategoryName, index) => {
                                                        const mainCategory = organizedCategories.find(category => category.categoryName === mainCategoryName);

                                                        return (
                                                            <div key={index} className="sub-category-group">
                                                                <h4>{mainCategory.categoryName}</h4>
                                                                <div className="sub-categories">
                                                                    {mainCategory.subCategories.map((subCategory, subIndex) => (
                                                                        <div key={subIndex}>
                                                                            <label htmlFor={`sub-${index}-${subIndex}`}>{subCategory.subCategoryName}</label>
                                                                            <input
                                                                                type="checkbox"
                                                                                id={`sub-${index}-${subIndex}`}
                                                                                value={subCategory.subCategoryName}
                                                                                checked={selectedSubCategories[mainCategoryName]?.includes(subCategory.subCategoryName) || false}
                                                                                onChange={() => handleSubCategoryChange(mainCategoryName, subCategory.subCategoryName, selectedSubCategories, setSelectedSubCategories)}
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </label>
                                    </>
                                );
                            })()}

                            <button type="submit">{isEditing ? "שמור שינויים" : "שמור מוצר"}</button>
                        </form>

                    </div>
                </div>
            )}

            <table className="admin-table hidden md:block" >
                <thead>
                    <tr>
                        <th className="admin-th">תמונה</th>
                        <th className="admin-th">מזהה</th>
                        <th className="admin-th">שם מוצר</th>
                        <th className="admin-th">מק"ט</th>
                        <th className="admin-th">סוג</th>
                        <th className="admin-th">פעולות</th>
                    </tr>
                </thead>
                <tbody className="admin-tbody">
                    {filteredProducts?.map((product) => (
                        <tr key={product._id}>
                            <td className="admin-td"><img src={product["תמונות"]} alt={product.name} className="admin-img" /></td>
                            <td className="admin-td">{product.מזהה}</td>
                            <td className="admin-td">{product["שם"]}</td>
                            <td className="admin-td">{product['מק"ט']}</td>
                            <td className="admin-td">{product.סוג}</td>
                            <td className="admin-td">
                                <button className='btn m-2' onClick={() => openEditModal(product)}>ערוך</button>
                                <button className='btn-primary m-2' onClick={() => handleDelete(product._id)}>מחק</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPanel;
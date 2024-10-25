import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminPanel.css';
import { createProduct, deleteProduct, fetchProducts, updateProduct } from '../redux/actions/productActions';
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
    variations: [],
    attributes: [{ name: '', values: [{ value: '', price: '' }] }],
    quantities: []
};

const AdminPanel = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const products = useSelector((state) => state.products.products);
    const categories = useSelector((state) => state.categories);

    const [organizedCategories, setCategoriesOrganized] = useState([]);
    const [selectedMainCategories, setSelectedMainCategories] = useState([]);
    const [selectedSubCategories, setSelectedSubCategories] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // מצב עריכה
    const [newProduct, setNewProduct] = useState(initialProductState);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [quantityEnabled, setQuantityEnabled] = useState(false);
    const [quantityInput, setQuantityInput] = useState('');

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    useEffect(() => {
        setCategoriesOrganized(fetchCategories(categories));
    }, [categories]);

    useEffect(() => {
        setFilteredProducts(handleSearch(searchQuery, products));
    }, [searchQuery, products]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const selectedCategories = selectedMainCategories.map((mainCategoryName) => ({
            mainCategory: mainCategoryName,
            subCategories: selectedSubCategories[mainCategoryName] || []
        }));

        let updatedProduct = { ...newProduct, קטגוריות: selectedCategories };
        const categoriesString = updatedProduct.קטגוריות.map(category => {
            const mainCategory = category.mainCategory;
            const subCategories = category.subCategories;
            return subCategories.length > 0
                ? subCategories.map(sub => `${mainCategory} > ${sub}`).join(', ')
                : mainCategory;
        }).join(', ');

        updatedProduct.קטגוריות = categoriesString;

        if (Number(updatedProduct['מחיר מבצע']) === 0 || !updatedProduct['מחיר מבצע']) {
            delete updatedProduct['מחיר מבצע'];
        }

        if (updatedProduct.סוג === 'variable') {
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
            delete updatedProduct.attributes;
        }

        if (isEditing) {
            console.log(updateProduct, "PRODUCT AFTER EDIT");  // pipipi

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
        if (quantityInput && !isNaN(quantityInput)) {
            setNewProduct(prevState => ({
                ...prevState,
                quantities: [...prevState.quantities, Number(quantityInput)]
            }));
            setQuantityInput('');
        }
    };

    const openEditModal = (product) => {
        // אם המוצר הוא מסוג variable ואין לו attributes, נוודא שהשדה מוגדר
        const productToEdit = { ...product };
        if (productToEdit.סוג === 'variable' && !productToEdit.attributes) {
            productToEdit.attributes = [{ name: '', values: [{ value: '', price: '' }] }];
        }

        setNewProduct(productToEdit);
        setIsEditing(true);
        setShowForm(true);
    };

    return (
        <div className="admin-panel">
            <h1>פאנל ניהול</h1>
            <button className="admin-button" onClick={() => {
                setIsEditing(false);
                setNewProduct(initialProductState);
                setShowForm(true);
            }}>הוסף מוצר חדש</button>

            <input
                type="text"
                placeholder="חפש לפי מזהה/מק״ט/שם"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-bar"
            />

            {showForm && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowForm(false)}>&times;</span>
                        <h2>{isEditing ? "ערוך מוצר" : "הוסף מוצר חדש"}</h2>
                        <form onSubmit={handleSubmit}>
                            <label>
                                מזהה:
                                <input type="number" name="מזהה" value={newProduct.מזהה} onChange={(e) => handleInputChange(e, setNewProduct)} required />
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
                                        <div key={index}>
                                            <label>
                                                שם מאפיין:
                                                <input
                                                    type="text"
                                                    value={attribute.name}
                                                    onChange={(e) => handleAttributeChange(index, 'name', e.target.value, newProduct, setNewProduct)}
                                                    required
                                                />
                                            </label>
                                            {attribute.values.map((valueObj, valueIndex) => (
                                                <div key={valueIndex}>
                                                    <label>
                                                        ערך מאפיין:
                                                        <input
                                                            type="text"
                                                            value={valueObj.value}
                                                            onChange={(e) => handleAttributeValueChange(index, valueIndex, 'value', e.target.value, newProduct, setNewProduct)}
                                                            required
                                                        />
                                                    </label>
                                                    <label>
                                                        מחיר מאפיין:
                                                        <input
                                                            type="number"
                                                            value={valueObj.price}
                                                            onChange={(e) => handleAttributeValueChange(index, valueIndex, 'price', e.target.value, newProduct, setNewProduct)}
                                                            required
                                                        />
                                                    </label>
                                                </div>
                                            ))}
                                            <button type="button" onClick={() => handleAddAttributeValue(index, newProduct, setNewProduct)}>+ הוסף ערך מאפיין</button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => handleAddAttribute(newProduct, setNewProduct)}>+ הוסף שם מאפיין</button>
                                </>
                            )}

                            <label>
                                <input
                                    type="checkbox"
                                    checked={quantityEnabled}
                                    onChange={() => setQuantityEnabled(!quantityEnabled)}
                                />
                                אופציה לכמות
                            </label>

                            {quantityEnabled && (
                                <div className="quantity-input-section">
                                    <input
                                        type="number"
                                        placeholder="הכנס כמות"
                                        value={quantityInput}
                                        onChange={(e) => setQuantityInput(e.target.value)}
                                    />
                                    <button type="button" onClick={handleAddQuantity}>הוסף כמות</button>
                                    <div className="quantities-display">
                                        {newProduct.quantities.map((qty, idx) => (
                                            <span key={idx} className="quantity-item">{qty}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

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
                                תיאור:
                                <textarea name="תיאור" value={newProduct.תיאור} onChange={(e) => handleInputChange(e, setNewProduct)} />
                            </label>
                            <label>
                                מחיר רגיל:
                                <input type="number" name="מחיר רגיל" value={newProduct['מחיר רגיל']} onChange={(e) => handleInputChange(e, setNewProduct)} />
                            </label>
                            <label>
                                מחיר מבצע:
                                <input type="number" name="מחיר מבצע" value={newProduct['מחיר מבצע']} onChange={(e) => handleInputChange(e, setNewProduct)} />
                            </label>

                            <label>
                                תמונות:
                                <input type="text" name="תמונות" value={newProduct.תמונות} onChange={(e) => handleInputChange(e, setNewProduct)} />
                            </label>

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

                            <button type="submit">{isEditing ? "שמור שינויים" : "שמור מוצר"}</button>
                        </form>
                    </div>
                </div>
            )}

            <table className="admin-table">
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
                <tbody>
                    {filteredProducts?.map((product) => (
                        <tr key={product._id}>
                            <td className="admin-td"><img src={product["תמונות"]} alt={product.name} className="admin-img" /></td>
                            <td className="admin-td">{product.מזהה}</td>
                            <td className="admin-td">{product["שם"]}</td>
                            <td className="admin-td">{product['מק"ט']}</td>
                            <td className="admin-td">{product.סוג}</td>
                            <td className="admin-td">
                                <button onClick={() => openEditModal(product)}>ערוך</button>
                                <button onClick={() => handleDelete(product._id)}>מחק</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPanel;
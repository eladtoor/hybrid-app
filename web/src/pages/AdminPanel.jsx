import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Import dispatch and selector
import { useNavigate } from 'react-router-dom';
import '../styles/AdminPanel.css';
import { createProduct } from '../redux/actions/productActions'; // Import the action to create a product

const initialProductState = {
    מזהה: '',
    סוג: 'simple', // Default to 'simple'
    'מק"ט': '',
    שם: '',
    'תיאור קצר': '',
    תיאור: '',
    'מחיר מבצע': '',
    'מחיר רגיל': '',
    קטגוריות: [], // Will contain selected categories and subcategories
    תמונות: '',
    variations: [],
    attributes: [] // For storing attribute names and values
};

const AdminPanel = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch(); // Initialize dispatch for Redux actions

    const products = useSelector((state) => state.products.products);
    const categories = useSelector((state) => state.categories);

    const [organizedCategories, setCategoriesOrganized] = useState([]);
    const [selectedMainCategories, setSelectedMainCategories] = useState([]); // Selected main categories
    const [selectedSubCategories, setSelectedSubCategories] = useState({}); // Selected subcategories per main category
    const [showForm, setShowForm] = useState(false);
    const [newProduct, setNewProduct] = useState(initialProductState); // Set the initial state

    useEffect(() => {
        if (categories?.categories?.companyCategories) {
            const organizedCategories = fetchCategories();
            setCategoriesOrganized(organizedCategories);
        }
    }, [categories]);

    const fetchCategories = () => {
        if (categories?.categories?.companyCategories) {
            const mainCategoriesWithSubcategories = Object.values(categories.categories.companyCategories).map((category) => ({
                categoryName: category.categoryName,
                subCategories: category.subCategories.map((subCategory) => ({
                    subCategoryName: subCategory.subCategoryName
                }))
            }));
            return mainCategoriesWithSubcategories;
        }
        return [];
    };

    const handleMainCategoryChange = (categoryName) => {
        setSelectedMainCategories((prevSelected) => {
            const alreadySelected = prevSelected.includes(categoryName);
            if (alreadySelected) {
                const updated = prevSelected.filter((name) => name !== categoryName);
                const { [categoryName]: _, ...rest } = selectedSubCategories; // Remove subcategories of deselected main category
                setSelectedSubCategories(rest);
                return updated;
            } else {
                return [...prevSelected, categoryName];
            }
        });
    };

    const handleSubCategoryChange = (mainCategoryName, subCategoryName) => {
        setSelectedSubCategories((prevSelected) => {
            const subCategoriesForMain = prevSelected[mainCategoryName] || [];
            const alreadySelected = subCategoriesForMain.includes(subCategoryName);
            const updatedSubCategories = alreadySelected
                ? subCategoriesForMain.filter((name) => name !== subCategoryName)
                : [...subCategoriesForMain, subCategoryName];

            return {
                ...prevSelected,
                [mainCategoryName]: updatedSubCategories
            };
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value
        }));
    };

    const handleRadioChange = (e) => {
        setNewProduct((prevProduct) => ({
            ...prevProduct,
            סוג: e.target.value
        }));
    };

    const handleAttributeChange = (index, field, value) => {
        const updatedAttributes = newProduct.attributes.map((attribute, i) =>
            i === index ? { ...attribute, [field]: value } : attribute
        );
        setNewProduct({ ...newProduct, attributes: updatedAttributes });
    };

    const handleAttributeValueChange = (attrIndex, valueIndex, value) => {
        const updatedAttributes = newProduct.attributes.map((attribute, i) =>
            i === attrIndex
                ? {
                    ...attribute,
                    values: attribute.values.map((val, j) =>
                        j === valueIndex ? value : val
                    )
                }
                : attribute
        );
        setNewProduct({ ...newProduct, attributes: updatedAttributes });
    };

    const handleAddAttribute = () => {
        setNewProduct((prevProduct) => ({
            ...prevProduct,
            attributes: [...prevProduct.attributes, { name: '', values: [''] }]
        }));
    };

    const handleAddAttributeValue = (index) => {
        const updatedAttributes = newProduct.attributes.map((attribute, i) =>
            i === index ? { ...attribute, values: [...attribute.values, ''] } : attribute
        );
        setNewProduct({ ...newProduct, attributes: updatedAttributes });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const selectedCategories = selectedMainCategories.map((mainCategoryName) => ({
            mainCategory: mainCategoryName,
            subCategories: selectedSubCategories[mainCategoryName] || []
        }));

        let updatedProduct = { ...newProduct, קטגוריות: selectedCategories };

        // Convert קטגוריות array into the desired string format
        const categoriesString = updatedProduct.קטגוריות.map(category => {
            const mainCategory = category.mainCategory;
            const subCategories = category.subCategories;
            if (subCategories.length > 0) {
                return subCategories.map(sub => `${mainCategory} > ${sub}`).join(', ');
            } else {
                return mainCategory;
            }
        }).join(', ');

        // Set the קטגוריות field to the resulting string
        updatedProduct.קטגוריות = categoriesString;

        // Handle variable products
        if (updatedProduct.סוג === 'variable') {
            const attributeNames = updatedProduct.attributes.map((attr) => attr.name);
            const attributeValues = updatedProduct.attributes.map((attr) => attr.values);

            const combinations = generateCombinations(attributeValues);

            const variations = combinations.map((combination, index) => {
                const attributes = {};
                combination.forEach((value, i) => {
                    attributes[`${attributeNames[i]}`] = value;
                });

                return {
                    מזהה: Math.floor(Math.random() * 100000),
                    סוג: 'variation',
                    שם: `${updatedProduct.שם} - ${combination.join(', ')}`,
                    'תיאור קצר': updatedProduct['תיאור קצר'],
                    attributes: attributes
                };
            });

            updatedProduct = {
                ...updatedProduct,
                variations: variations,
            };

            delete updatedProduct.attributes;
        }

        // Remove attributes for simple products
        if (updatedProduct.סוג === 'simple') {
            delete updatedProduct.attributes;
        }

        // Dispatch the action to create the product
        dispatch(createProduct(updatedProduct));

        // Reset form state after submission
        setNewProduct(initialProductState);
        handleCloseModal();
    };

    const generateCombinations = (arrays) => {
        if (arrays.length === 0) return [[]];
        const firstArray = arrays[0];
        const restArrays = generateCombinations(arrays.slice(1));
        const combinations = [];
        firstArray.forEach((value) => {
            restArrays.forEach((rest) => {
                combinations.push([value, ...rest]);
            });
        });
        return combinations;
    };

    const handleAddProduct = () => {
        // Reset form when adding a new product
        setNewProduct(initialProductState);
        setSelectedMainCategories([]); // Reset selected categories
        setSelectedSubCategories({}); // Reset selected subcategories
        setShowForm(true); // Open the modal
    };

    const handleCloseModal = () => {
        setShowForm(false); // Close the modal
    };

    return (
        <div className="admin-panel">
            <h1>פאנל ניהול</h1>
            <button className="admin-button" onClick={handleAddProduct}>הוסף מוצר חדש</button>

            {showForm && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <h2>הוסף מוצר חדש</h2>
                        <form onSubmit={handleSubmit}>
                            {/* Main form fields */}
                            <label>
                                מזהה:
                                <input type="text" name="מזהה" value={newProduct.מזהה} onChange={handleInputChange} required />
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
                                            onChange={handleRadioChange}
                                        />
                                        Simple
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="סוג"
                                            value="variable"
                                            checked={newProduct.סוג === 'variable'}
                                            onChange={handleRadioChange}
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
                                                    onChange={(e) => handleAttributeChange(index, 'name', e.target.value)}
                                                    required
                                                />
                                            </label>
                                            {attribute.values.map((value, valueIndex) => (
                                                <div key={valueIndex}>
                                                    <label>
                                                        ערך מאפיין:
                                                        <input
                                                            type="text"
                                                            value={value}
                                                            onChange={(e) => handleAttributeValueChange(index, valueIndex, e.target.value)}
                                                            required
                                                        />
                                                    </label>
                                                </div>
                                            ))}
                                            <button type="button" onClick={() => handleAddAttributeValue(index)}>+ הוסף ערך מאפיין</button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={handleAddAttribute}>+ הוסף שם מאפיין</button>
                                </>
                            )}

                            <label>
                                מק"ט:
                                <input type="text" name='מק"ט' value={newProduct['מק"ט']} onChange={handleInputChange} required />
                            </label>
                            <label>
                                שם:
                                <input type="text" name="שם" value={newProduct.שם} onChange={handleInputChange} required />
                            </label>
                            <label>
                                תיאור קצר:
                                <textarea name="תיאור קצר" value={newProduct['תיאור קצר']} onChange={handleInputChange} />
                            </label>
                            <label>
                                תיאור:
                                <textarea name="תיאור" value={newProduct.תיאור} onChange={handleInputChange} />
                            </label>
                            <label>
                                מחיר רגיל:
                                <input type="number" name="מחיר רגיל" value={newProduct['מחיר רגיל']} onChange={handleInputChange} />
                            </label>
                            <label>
                                מחיר מבצע:
                                <input type="number" name="מחיר מבצע" value={newProduct['מחיר מבצע']} onChange={handleInputChange} />
                            </label>

                            <label>
                                תמונות:
                                <input type="text" name="תמונות" value={newProduct.תמונות} onChange={handleInputChange} />
                            </label>

                            {/* Categories section */}
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
                                                    onChange={() => handleMainCategoryChange(category.categoryName)}
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
                                                                    onChange={() => handleSubCategoryChange(mainCategoryName, subCategory.subCategoryName)}
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

                            <button type="submit">שמור מוצר</button>
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
                    {products?.map((product) => (
                        <tr key={product._id}>
                            <td className="admin-td"><img src={product["תמונות"]} alt={product.name} className="admin-img" /></td>
                            <td className="admin-td">{product.מזהה}</td>
                            <td className="admin-td">{product["שם"]}</td>
                            <td className="admin-td">{product['מק"ט']}</td>
                            <td className="admin-td">{product.סוג}</td>
                            <td className="admin-td">
                                <button>ערוך</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPanel;
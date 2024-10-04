import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import "../styles/Category.css";
import ProductCard from '../components/ProductCard'; // ייבוא הכרטיס של המוצרים

export const Subcategory = () => {
    const { subcategoryName } = useParams();
    const navigate = useNavigate();

    // Get company categories from Redux store
    const companyCategories = useSelector((state) => state.categories.categories?.companyCategories);
    const companyName = useSelector(state => state.categories).categories.companyName;

    // Check if companyCategories is defined and not null
    if (!companyCategories) {
        return <p>קטגוריות לא זמינות.</p>;
    }

    // Convert the subcategories to an array (if it's an object)
    const subcategoriesArray = Object.values(companyCategories || {});

    // Find the subcategory object based on the URL parameter
    const currentCategory = subcategoriesArray.find(category => category.categoryName === subcategoryName);

    if (!currentCategory) {
        return <p>לא נמצאה קטגוריה בשם {subcategoryName}.</p>;
    }

    const subCategories = currentCategory.subCategories || [];
    const products = currentCategory.products || [];


    const moveToSubcategory = (subcategoryName) => {
        navigate(`/${companyName}/${currentCategory.categoryName}/${subcategoryName}/products`);
    }

    return (
        <div className="category-section">
            <div className="sub-category">
                <hr className='hr'></hr>
                <h2 className="category-title">{subcategoryName}</h2>

                {/* Display subcategories if they exist */}
                {subCategories.length > 0 && (
                    <div className="subcategory-container">
                        <div className="subcategory-list">
                            {subCategories.map((subcategory, index) => (
                                <button
                                    key={index}
                                    className="subcategory-card"
                                    onClick={() => moveToSubcategory(subcategory.subCategoryName)}
                                >
                                    {/* Display subcategory image */}
                                    <img
                                        src={subcategory.products?.[0]?.image || '/default-image.png'}
                                        alt={subcategory.subCategoryName}
                                        className="subcategory-image"
                                    />
                                    <hr className='hr-card'></hr>
                                    {/* Display subcategory name */}
                                    <p className="subcategory-name">{subcategory.subCategoryName}</p>

                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Add the horizontal separator */}
            <hr className='hr'></hr> {/* This separates categories from products */}

            {/* Display products directly in the category */}
            {products.length > 0 && (
                <div className="sub-category">
                    <div className="product-container">
                        <div className="product-list">
                            {products.map((product) => (
                                <ProductCard key={product.productId} product={product} />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Message if no products or subcategories are found */}
            {subCategories.length === 0 && products.length === 0 && (
                <p>לא נמצאו מוצרים או תתי קטגוריות בקטגוריה.</p>
            )}
        </div>
    );
};

export default Subcategory;

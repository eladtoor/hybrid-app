import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
        <div className="max-w-6xl mx-auto mt-24 p-6">
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">{subcategoryName}</h2>

                {subCategories.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {subCategories.map((subcategory, index) => (
                            <button
                                key={index}
                                className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg transition"
                                onClick={() => moveToSubcategory(subcategory.subCategoryName)}
                            >
                                <img
                                    src={subcategory.products?.[0]?.תמונות || '/default-image.png'}
                                    alt={subcategory.subCategoryName}
                                    className="w-full h-40 object-cover rounded-md"
                                />
                                <p className="mt-2 text-lg font-semibold text-gray-700">{subcategory.subCategoryName}</p>
                            </button>
                        ))}
                    </div>
                )}

                <hr className="my-8 border-gray-300" />

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.productId} product={product} />
                        ))}
                    </div>
                ) : (
                    <p className="text-lg text-gray-600">לא נמצאו מוצרים או תתי קטגוריות בקטגוריה.</p>
                )}
            </div>
        </div>
    );
};

export default Subcategory;

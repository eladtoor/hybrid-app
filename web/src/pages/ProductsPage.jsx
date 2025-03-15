import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard';

const ProductsPage = () => {
    const { categoryname, subcategoryname } = useParams();

    // Get categories from Redux store
    const companyCategories = useSelector((state) => state.categories.categories?.companyCategories);
    console.log(companyCategories, "im here");

    // Handle loading state
    if (!companyCategories) {
        return <h2 className="text-center text-gray-600 mt-10">טוען קטגוריות...</h2>;
    }

    // Convert categories to array and find the current category
    const categoriesArray = Object.values(companyCategories);
    const currentCategory = categoriesArray.find(category => category.categoryName === categoryname);

    if (!currentCategory) {
        return <h2 className="text-center text-gray-600 mt-10">קטגוריה לא נמצאה</h2>;
    }

    const currentSubCategory = currentCategory.subCategories.find(subCategory => subCategory.subCategoryName === subcategoryname);

    if (!currentSubCategory) {
        return <h2 className="text-center text-gray-600 mt-10">תת-קטגוריה לא נמצאה</h2>;
    }

    return (
        <div className="max-w-6xl mx-auto mt-24 p-6">
            <div className="bg-white shadow-lg rounded-xl p-8 text-center border border-gray-200">
                {/* 🔹 כותרת הדף */}
                <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-gray-300 pb-2 inline-block">
                    {categoryname} <span className="text-gray-500">/</span> {subcategoryname}
                </h2>

                {/* 🔹 הצגת מוצרים */}
                {currentSubCategory.products.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-6">
                        {currentSubCategory.products.map((product) => (
                            <ProductCard key={product.productId} product={product} />
                        ))}
                    </div>
                ) : (
                    <p className="text-lg text-gray-600 mt-4">
                        לא נמצאו מוצרים בקטגוריה זו.
                    </p>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;

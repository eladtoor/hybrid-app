import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard';


const ProductsPage = () => {
    const { categoryname } = useParams();
    const { subcategoryname } = useParams();

    // Safely access the companyCategories from Redux store
    const companyCategories = useSelector((state) => state.categories.categories?.companyCategories);
    console.log(companyCategories, "im here");

    // Check if companyCategories is available before proceeding
    if (!companyCategories) {
        return <h2>Loading categories...</h2>;
    }




    // Convert the object to an array only when it's defined
    const categoriesArray = Object.values(companyCategories);
    const currentCategory = categoriesArray.find(category => category.categoryName === categoryname);

    // Check if the current category exists
    if (!currentCategory) {
        return <h2>Category not found</h2>;
    }

    const currentSubCategory = currentCategory.subCategories.find(subCategory => subCategory.subCategoryName === subcategoryname);

    // Check if the current subcategory exists
    if (!currentSubCategory) {
        return <h2>Subcategory not found</h2>;
    }



    return (
        <div className="max-w-6xl mx-auto mt-24 p-6">
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">{`${categoryname}: ${subcategoryname}`}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {currentSubCategory.products.map((product) => (
                        <ProductCard key={product.productId} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;

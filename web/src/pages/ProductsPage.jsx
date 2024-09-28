import React from 'react';
import { useParams } from 'react-router-dom';
import '../styles/ProductsPage.css'; // Import the CSS file
import { useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard';
import "../styles/Category.css"


const ProductsPage = () => {
    const { categoryname } = useParams();
    const { subcategoryname } = useParams();

    // Safely access the companyCategories from Redux store
    const companyCategories = useSelector((state) => state.categories.categories?.companyCategories);

    // Check if companyCategories is available before proceeding
    if (!companyCategories) {
        return <h2>Loading categories...</h2>;
    }

    console.log(subcategoryname, categoryname);
    console.log(companyCategories);

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

    console.log("in productsPage", currentSubCategory);

    return (
        <div className="category-section">

            <div className="sub-category">
            <hr className='hr'></hr>

                <div className="product-page-container">
                    <h2 className="category-title">{`${categoryname}: ${subcategoryname}`}</h2>
                    <div className="product-list">
                        {currentSubCategory.products.map((product) => (
                            <ProductCard key={product.productId} product={product} />
                    ))}
                    </div>
                </div>
            </div>

        </div>

    );
};

export default ProductsPage;

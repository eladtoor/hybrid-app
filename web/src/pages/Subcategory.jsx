import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard';

export const Subcategory = () => {
    const { subcategoryName } = useParams();
    const navigate = useNavigate();

    const companyCategories = useSelector((state) => state.categories.categories?.companyCategories);
    const companyName = useSelector(state => state.categories?.categories?.companyName);

    const [categoryImages, setCategoryImages] = useState({});

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/category-images`)
            .then((res) => res.json())
            .then((data) => {
                const imagesMap = {};
                data.forEach((cat) => {
                    imagesMap[cat.name] = cat.image;
                });
                setCategoryImages(imagesMap);
            });
    }, []);

    if (!companyCategories) {
        return <p className="text-center text-gray-600 mt-10">קטגוריות לא זמינות.</p>;
    }

    const subcategoriesArray = Object.values(companyCategories || {});
    const currentCategory = subcategoriesArray.find(category => category.categoryName === subcategoryName);

    if (!currentCategory) {
        return <p className="text-center text-gray-600 mt-10">לא נמצאה קטגוריה בשם {subcategoryName}.</p>;
    }

    const isDigitalCatalogCategory = subcategoryName === "קטלוגים דיגיטלים להורדה"
    const subCategories = currentCategory.subCategories || [];
    const products = currentCategory.products || [];

    const moveToSubcategory = (subcategoryName) => {
        navigate(`/${companyName}/${currentCategory.categoryName}/${subcategoryName}/products`);
    };

    return (
        <div className="max-w-6xl mx-auto mt-24 p-6">
            <div className="bg-white shadow-lg rounded-xl p-8 text-center border border-gray-200">
                {subcategoryName !== "קטלוגים דיגיטלים להורדה" && <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-gray-300 pb-2 inline-block">
                    {subcategoryName}
                </h2>}

                {!isDigitalCatalogCategory && subCategories.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-6">
                        {subCategories.map((subcategory, index) => (
                            <button
                                key={index}
                                className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-md transition-all hover:scale-105 flex flex-col items-center"
                                onClick={() => moveToSubcategory(subcategory.subCategoryName)}
                            >
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-300 hover:border-primary transition">
                                    <img
                                        src={
                                            categoryImages[`${currentCategory.categoryName} - ${subcategory.subCategoryName}`] ||
                                            subcategory.products?.[0]?.תמונות ||
                                            '/default-image.png'
                                        }
                                        alt={subcategory.subCategoryName}
                                        className="w-full h-full object-cover hover:brightness-110 transition-all duration-300"
                                    />
                                </div>
                                <p className="mt-3 text-lg font-semibold text-gray-800">
                                    {subcategory.subCategoryName}
                                </p>
                            </button>
                        ))}
                    </div>
                )}

                <hr className="my-8 border-gray-300" />
                <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-gray-300 pb-2 inline-block">
                    מוצרים מקטגוריה זו
                </h2>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-6 justify-items-center">
                        {products.map((product) => (
                            <ProductCard
                                key={product.productId}
                                product={product}
                                isDigitalCatalogCategory={isDigitalCatalogCategory}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-lg text-gray-600 mt-4">
                        לא נמצאו מוצרים או תתי קטגוריות בקטגוריה זו.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Subcategory;

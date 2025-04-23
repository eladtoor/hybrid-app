import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Category = ({ title, subcategories }) => {
    const navigate = useNavigate();
    const [categoryImages, setCategoryImages] = useState([]);

    const moveToSubcategory = (subcategoryName) => {
        navigate(`/${title}/${subcategoryName}`);
    };

    const subcategoryArray = Object.values(subcategories);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/category-images`)
            .then((res) => res.json())
            .then((data) => setCategoryImages(data));
    }, []);

    return (
        <div className="w-full px-6 py-10 bg-white rounded-xl shadow-md border border-gray-200">
            {/* כותרת קטגוריה */}
            <h2 className="text-3xl font-bold text-gray-900 text-right pr-6 border-r-4 border-primary">
                {title}
            </h2>

            {/* רשימת תת קטגוריות */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 justify-center mt-8">
                {subcategoryArray.length > 0 ? (
                    subcategoryArray.map((subcategory, index) => {
                        const imageForCategory = categoryImages.find(
                            (cat) => cat.name === subcategory.categoryName
                        )?.image;

                        return (
                            <button
                                key={index}
                                className="flex flex-col items-center bg-gray-50 shadow-md rounded-xl p-5 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                                onClick={() => moveToSubcategory(subcategory.categoryName)}
                            >
                                {/* תמונה של תת-קטגוריה */}
                                <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-gray-300 hover:border-primary transition-all duration-300">
                                    <img
                                        src={
                                            imageForCategory ||
                                            subcategory.subCategories[0]?.products[0].תמונות ||
                                            subcategory.products[0].תמונות
                                        }
                                        alt={subcategory.categoryName}
                                        className="w-full h-full object-cover hover:brightness-110 transition-all duration-300"
                                    />
                                </div>

                                {/* שם תת קטגוריה */}
                                <p className="text-lg font-semibold text-gray-800 mt-4">
                                    {subcategory.categoryName}
                                </p>
                            </button>
                        );
                    })
                ) : (
                    <p className="text-gray-500">אין תת-קטגוריות זמינות</p>
                )}
            </div>

        </div>
    );
};

export default Category;

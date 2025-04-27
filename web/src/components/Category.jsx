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
        <div className="w-full px-3 md:px-6 py-6 md:py-10 bg-white rounded-xl shadow-md border border-gray-200">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-right pr-3 md:pr-6 border-r-4 border-primary">
                {title}
            </h2>

            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8 justify-center mt-6 md:mt-8">
                {subcategoryArray.length > 0 ? (
                    subcategoryArray.map((subcategory, index) => {
                        const imageForCategory = categoryImages.find(
                            (cat) => cat.name === subcategory.categoryName
                        )?.image;

                        return (
                            <button
                                key={index}
                                className="flex flex-col items-center bg-gray-50 shadow-md rounded-xl p-3 md:p-5 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                                onClick={() => moveToSubcategory(subcategory.categoryName)}
                            >
                                <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-gray-300 hover:border-primary transition-all duration-300">
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

                                <p className="text-base md:text-lg font-semibold text-gray-800 mt-3 md:mt-4 text-center">
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
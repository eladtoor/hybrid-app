import React from "react";
import { useSelector } from "react-redux";
import { uploadImageToCloudinary } from "../utils/cloudinaryUpload";
import { useEffect, useState } from "react";

const CategoryImageManager = ({ organizedCategories }) => {

    const [categoryImages, setCategoryImages] = useState({});

    useEffect(() => {
        // שליפת תמונות קיימות
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

    const handleImageUpload = async (categoryName, file) => {
        try {
            const imageUrl = await uploadImageToCloudinary(file);
            await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/category-images`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: categoryName, image: imageUrl }),
            });
            setCategoryImages((prev) => ({ ...prev, [categoryName]: imageUrl }));
            alert("תמונה עודכנה בהצלחה לקטגוריה!");
        } catch (error) {
            console.error("❌ שגיאה בהעלאת תמונה לקטגוריה:", error);
            alert("שגיאה בהעלאה");
        }
    };

    return (
        <div className="space-y-10">
            {organizedCategories.map((category) => (
                <div key={category.categoryName} className="space-y-4">
                    {/* קטגוריה ראשית */}
                    <div className="flex items-center gap-4">
                        <div className="w-28 h-28 border rounded overflow-hidden">
                            {categoryImages[category.categoryName] ? (
                                <img
                                    src={categoryImages[category.categoryName]}
                                    alt={category.categoryName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                    אין תמונה
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="font-bold text-lg">{category.categoryName}</p>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    handleImageUpload(category.categoryName, e.target.files[0])
                                }
                            />
                        </div>
                    </div>

                    {/* תתי קטגוריות */}
                    {category.subCategories?.map((sub) => (
                        <div key={sub.subCategoryName} className="flex items-center gap-4 ml-12">
                            <div className="w-20 h-20 border rounded overflow-hidden">
                                {categoryImages[`${category.categoryName} - ${sub.subCategoryName}`] ? (
                                    <img
                                        src={
                                            categoryImages[
                                            `${category.categoryName} - ${sub.subCategoryName}`
                                            ]
                                        }
                                        alt={sub.subCategoryName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                        אין תמונה
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="font-semibold">{sub.subCategoryName}</p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        handleImageUpload(
                                            `${category.categoryName} - ${sub.subCategoryName}`,
                                            e.target.files[0]
                                        )
                                    }
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );

};

export default CategoryImageManager;

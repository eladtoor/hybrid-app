import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";

const RecommendedProducts = () => {
    const products = useSelector((state) => state.products.products);

    // פונקציה שמחזירה 10 מוצרים רנדומליים
    const randomProducts = useMemo(() => {
        if (!products.length) return [];
        const shuffled = [...products].sort(() => 0.5 - Math.random()); // ערבוב מוצרים
        return shuffled.slice(0, 10); // חיתוך ל-10 מוצרים בלבד
    }, [products]);

    return (
        <div className="w-full px-6 py-10 bg-white rounded-xl shadow-md border border-gray-200">
            {/* כותרת מוצרים מומלצים */}
            <h2 className="text-3xl font-bold text-gray-900 text-right pr-6 border-r-4 border-yellow-500">
                מוצרים מומלצים
            </h2>

            {/* רשימת מוצרים */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-center mt-8">
                {randomProducts.length > 0 ? (
                    randomProducts.map((product) => (
                        <div
                            key={product._id}
                            className="flex flex-col items-center bg-gray-50 shadow-md rounded-xl p-5 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                        >
                            <ProductCard product={product} />
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center">אין מוצרים זמינים</p>
                )}
            </div>
        </div>
    );
};

export default RecommendedProducts;

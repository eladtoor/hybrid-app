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
        <div className="w-full px-4 sm:px-6 py-8 sm:py-10 bg-white rounded-xl shadow-md border border-gray-200">
            {/* כותרת מוצרים מומלצים */}
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-right pr-4 sm:pr-6 border-r-4 border-primary">
                מוצרים מומלצים
            </h2>

            {/* רשימת מוצרים */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6 justify-items-center mt-6 sm:mt-8">
                {randomProducts.length > 0 ? (
                    randomProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))
                ) : (
                    <p className="text-gray-500 text-center">אין מוצרים זמינים</p>
                )}
            </div>
        </div>
    );
};

export default RecommendedProducts;
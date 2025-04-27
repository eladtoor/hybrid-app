import React from 'react';
import { useSelector } from 'react-redux';
import ProductCard from './ProductCard';

const DiscountedProducts = ({ discountedProducts }) => {
    const allProducts = useSelector((state) => state.products.products);

    const discountedFullProducts = discountedProducts.map((discountItem) => {
        const fullProduct = allProducts.find((product) => product._id === discountItem.productId);
        return {
            ...fullProduct,
            discount: discountItem.discount,
        };
    }).filter((product) => product);

    if (discountedFullProducts.length === 0) {
        return (
            <div className="text-center text-gray-700 mt-6">
                אין מוצרים בהנחה כרגע.
            </div>
        );
    }

    return (
        <div className="w-full px-4 sm:px-6 py-8 sm:py-10 bg-white rounded-xl shadow-md border border-gray-200 mt-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 text-center border-b pb-2">
                מוצרים בהנחה עבורך
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6 justify-items-center">
                {discountedFullProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default DiscountedProducts;

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
        <div className="w-full bg-white shadow-lg rounded-lg p-6 mt-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center border-b pb-2">
                מוצרים בהנחה עבורך
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {discountedFullProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default DiscountedProducts;

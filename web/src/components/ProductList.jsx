import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../redux/actions/productActions';

const ProductList = () => {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector(state => state.products);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    if (loading) return <p className="text-center text-gray-600">טוען...</p>;
    if (error) return <p className="text-center text-red-500">שגיאה: {error}</p>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">רשימת מוצרים</h1>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                    <li key={product._id} className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition">
                        <h2 className="text-xl font-semibold text-gray-700">{product.productName}</h2>
                        <p className="text-gray-600 mt-2">{product.description}</p>
                        <p className="text-lg font-bold text-green-600 mt-2">₪{product.price}</p>
                        <img src={product.image} alt={product.productName} className="w-full h-40 object-cover rounded-md mt-4" />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../redux/actions/productActions';

const ProductList = () => {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector(state => state.products);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Product List</h1>
            <ul>
                {products.map(product => (
                    <li key={product._id}>
                        <h2>{product.productName}</h2>
                        <p>{product.description}</p>
                        <p>Price: {product.price}</p>
                        <img src={product.image} alt={product.productName} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;
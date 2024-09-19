import React from 'react'
import { useParams } from 'react-router-dom';
import "../styles/Subcategory.css"
import ProductCard from '../components/ProductCard';


export const Subcategory = () => {
    const { subcategoryName } = useParams();
    const exampleProducts = [
        { id: 1, name: 'Product 1', image: '/product1.png' },
        { id: 2, name: 'Product 2', image: '/product2.png' },
        // More products
    ];


    return (
        <div className="subcategory-container">
            <h1 className="subcategory-title">Subcategory: {subcategoryName}</h1>
            <div className="subcategory-items">
                {exampleProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    )
}

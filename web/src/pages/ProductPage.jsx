import React from 'react';
import { useParams } from 'react-router-dom';
import '../styles/ProductPage.css'; // Import the CSS file

const ProductPage = () => {
    const { productId } = useParams();

    // Example product object; replace with actual data fetching logic
    const product = {
        name: "Product Name",
        image: "/product1.png",
        description: "This is an example product description. Add more details here."
    };

    if (!product) {
        return <h2>Product not found</h2>;
    }

    return (
        <div className="product-page-container">
            <img src={product.image} alt={product.name} className="product-page-image" />
            <h1 className="product-page-title">{product.name}</h1>
            <p className="product-page-description">{product.description}</p>
            <div className="product-page-actions">
                <button className="product-page-button">הוסף לעגלה</button>
                <button className="product-page-button">הוסף ועבור לעגלה</button>
            </div>
        </div>
    );
};

export default ProductPage;
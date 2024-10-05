import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard'; // כרטיס מוצר בעיצוב של דף הבית
import '../styles/SearchResults.css';

const SearchResults = ({ products }) => {
    const [filteredProducts, setFilteredProducts] = useState([]);
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('query');

    useEffect(() => {
        if (query && products.length > 0) {
            const lowerQuery = query.toLowerCase();

            // שימוש ב-RegExp לחיפוש דומה
            const regex = new RegExp(lowerQuery.split('').join('.*'), 'i');

            // נסה להמיר את query למספר במידה וזה מספר
            const queryAsNumber = Number(query);

            // מסנן את המוצרים על פי השם, SKU, ו-ID, ומציג רק את 9 הקרובים ביותר
            const results = products.filter(product =>
                regex.test(product['שם']) || // התאמה לשם המוצר
                regex.test(product['מק"ט']) || // התאמה ל-SKU
                product['מזהה'] === query || // התאמה מדויקת למזהה כמחרוזת
                product['מזהה'] === queryAsNumber // התאמה מדויקת למזהה כמספר
            ).slice(0, 9); // הצגת 9 המוצרים הקרובים ביותר לתוצאה

            setFilteredProducts(results);
        }
    }, [query, products]);

    return (
        <div className="search-results-page">
            {console.log(filteredProducts, "here")
            }            <h2>תוצאות חיפוש עבור: {query}</h2>
            {console.log(filteredProducts)
            }
            <div className="product-list">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (

                        <ProductCard key={product._id} product={product} />
                    ))
                ) : (
                    <p>לא נמצאו תוצאות תואמות.</p>
                )}
            </div>
        </div>
    );
};

export default SearchResults;

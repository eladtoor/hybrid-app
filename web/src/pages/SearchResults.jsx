import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const SearchResults = () => {
    const products = useSelector((state) => state.products.products); // ✅ קבלת מוצרים מעודכנים מה-Redux
    const [filteredProducts, setFilteredProducts] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search).get('query');

    useEffect(() => {
        console.log("🔄 Redux Products Updated in SearchResults:", products);
        if (query && products.length > 0) {
            const lowerQuery = query.toLowerCase();
            const regex = new RegExp(lowerQuery.split('').join('.*'), 'i');
            const queryAsNumber = Number(query);

            const exactNameMatches = products.filter(product =>
                product['שם'].toLowerCase() === lowerQuery
            );

            const partialMatches = products.filter(product => {
                const productIdString = String(product['מזהה']).trim();
                const productIdNumber = Number(product['מזהה']);

                const isExactIdMatch = productIdString === query.trim() || productIdNumber === queryAsNumber;
                const isNameMatch = regex.test(product['שם']);
                const isSkuMatch = regex.test(product['מק"ט']);

                return isExactIdMatch || isNameMatch || isSkuMatch;
            });

            const filteredPartialMatches = partialMatches.filter(product =>
                !exactNameMatches.includes(product)
            );

            const results = [...exactNameMatches, ...filteredPartialMatches].slice(0, 9);
            setFilteredProducts(results);
        }
    }, [query, products]); // ✅ מאזין לשינויים במוצרים ובשאילתת החיפוש

    const handleSearch = () => {
        if (query.trim()) {
            navigate(`/search?query=${query}`);
        }
    };

    return (
        <div className="max-w-screen-lg mx-auto mt-24 p-6">
            <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
                תוצאות חיפוש עבור: <span className="text-blue-600">{query}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))
                ) : (
                    <p className="text-center text-gray-500 col-span-full">
                        לא נמצאו תוצאות תואמות.
                    </p>
                )}
            </div>
        </div>
    );
};

export default SearchResults;

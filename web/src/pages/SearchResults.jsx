import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const SearchResults = ({ products }) => {
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search).get('query');

    useEffect(() => {
        if (query !== null) {
            setSearchQuery(query);
        }
    }, [query]);

    useEffect(() => {
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
    }, [query, products]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/search?query=${searchQuery}`);
            setSearchQuery('');
        }
    };

    return (
        <div className="max-w-screen-lg mx-auto mt-24 p-6">
            {/* Modern Search Box */}
            <div className="flex items-center justify-center mb-6">
                <input
                    type="text"
                    placeholder="חפש מוצרים..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full max-w-md px-4 py-2 border rounded-l-md focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
                <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition"
                >
                    <i className="fa fa-search"></i>
                </button>
            </div>

            {/* Search Results Header */}
            {query && query.trim() !== '' && (
                <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
                    תוצאות חיפוש עבור: <span className="text-blue-600">{query}</span>
                </h2>
            )}

            {/* Products List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {query && query.trim() !== '' && filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))
                ) : query && query.trim() !== '' ? (
                    <p className="text-center text-gray-500 col-span-full">
                        לא נמצאו תוצאות תואמות.
                    </p>
                ) : (
                    !isMobile && (
                        <p className="text-center text-gray-500 col-span-full">
                            הזן מונח חיפוש כדי להציג תוצאות.
                        </p>
                    )
                )}
            </div>
        </div>
    );
};

export default SearchResults;

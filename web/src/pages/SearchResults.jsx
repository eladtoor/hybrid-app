import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import '../styles/SearchResults.css';

const SearchResults = ({ products }) => {
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search).get('query');


    useEffect(() => {
        if (query !== null) { // ✅ נוודא שהתוכן לא יוחלף לריק בלי סיבה
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

            const partialMatches = products.filter(product =>
                regex.test(product['שם']) ||
                regex.test(product['מק"ט']) ||
                product['מזהה'] === query ||
                product['מזהה'] === queryAsNumber
            );

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
            setSearchQuery(''); // ✅ מאפס את שדה החיפוש לאחר החיפוש
        }
    };


    return (
        <div className={`search-results-page ${isMobile ? 'mobile-view' : ''}`}>

            {/* ✅ חיפוש במובייל - מוצג בראש הדף */}
            {isMobile && (
                <div className="search-box-mobile">

                    <input
                        type="text"
                        placeholder="חפש מוצרים..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button onClick={handleSearch}>
                        <i className="fa fa-search"></i>
                    </button>
                </div>
            )}

            {/* ✅ הצגת הכותרת רק אם יש חיפוש */}
            {query && query.trim() !== '' && <h2>תוצאות חיפוש עבור: {query}</h2>}

            <div className={`product-list ${isMobile ? 'mobile-layout' : ''}`}>
                {query && query.trim() !== '' && filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))
                ) : query && query.trim() !== '' ? (
                    <p className="not-found">לא נמצאו תוצאות תואמות.</p>
                ) : (
                    // ❗ הצגת הודעה אם **אין חיפוש** ורק **בתצוגה רגילה**
                    !isMobile && <p className="search-hint">הזן מונח חיפוש כדי להציג תוצאות</p>
                )}
            </div>
        </div>
    );


}
export default SearchResults;

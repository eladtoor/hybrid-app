import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import '../styles/HomePage.css';
import Carousel from '../components/Carousel';
import Category from '../components/Category';

const HomePage = ({ categories, products }) => {
    const loadingCategories = useSelector((state) => state.categories.loading);
    const loadingProducts = useSelector((state) => state.products.loading);

    const user = useSelector(state => state?.user?.user);
    const userFromStorage = JSON.parse(localStorage.getItem('user'));

    return (
        <div className="home-page">
            <Carousel />
            {user || userFromStorage ? (
                <h2>ברוך הבא {userFromStorage?.name || user?.name}</h2>
            ) : ""}

            {/* הצגת הקטגוריות */}
            <div className="category-section">
                {loadingCategories ? (
                    <p>טוען קטגוריות...</p>
                ) : categories?.companyCategories ? (
                    <Category title={categories.companyName} subcategories={categories.companyCategories} />
                ) : (
                    <p>אין קטגוריות זמינות.</p>
                )}
            </div>

            {/* הצגת המוצרים */}
            <div className="product-section">
                {loadingProducts ? (
                    <p>טוען מוצרים...</p>
                ) : products?.length > 0 ? (
                    products.map((product) => (
                        <div key={product.id}>
                            {/* הוסף את עיצוב הצגת המוצרים */}
                            <p>{product.name}</p>
                        </div>
                    ))
                ) : (
                    <p>אין מוצרים זמינים.</p>
                )}
            </div>
        </div>
    );
};

export default HomePage;

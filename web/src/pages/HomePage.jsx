import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import '../styles/HomePage.css';
import Carousel from '../components/Carousel';
import Category from '../components/Category';
import { useNavigate } from 'react-router-dom';

const HomePage = ({ categories, products }) => {
    const loadingCategories = useSelector((state) => state.categories.loading);
    const loadingProducts = useSelector((state) => state.products.loading);
    const navigate = useNavigate();
    const user = useSelector(state => state?.user?.user);
    const userFromStorage = JSON.parse(localStorage.getItem('user'));

    const handleLoginClick = () => {
        navigate('/login');
    };
    console.log(products);
    console.log(categories);


    return (
        <div className="home-page">
            <Carousel />
            {/* הצגת הודעה "ברוך הבא" או כפתור "התחבר עכשיו" */}
            {user || userFromStorage ? (
                <h2 className='welcome'>ברוך הבא {userFromStorage?.name || user?.name}</h2>
            ) : (
                <button className="login-button" onClick={handleLoginClick}>
                    התחבר עכשיו
                </button>
            )}
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


            <div className="product-section">
                {loadingProducts ? (
                    <p>טוען מוצרים...</p>
                ) : products?.length > 0 ? (
                    products.map((product) => (
                        <div key={product._id}>

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

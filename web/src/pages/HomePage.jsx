import React, { useEffect }, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../styles/HomePage.css';
import Carousel from '../components/Carousel';
import Category from '../components/Category';

const HomePage = ({ categories }) => {
    // Get userDetails from Redux store
    const user = useSelector(state => state ? state.user.user : null);

    // Use useEffect to sync userDetails with localStorage
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        }
    }, [user]);

    const userFromStorage = JSON.parse(localStorage.getItem('user'));



    // בדיקה אם categories מוגדר ואם הוא כולל את companyCategories
    const companyCategories = categories?.companyCategories;

    // אם companyCategories הוא אובייקט, נשתמש ב-Object.values כדי לקבל מערך של קטגוריות
    const categoryArray = Array.isArray(companyCategories) ? companyCategories : Object.values(companyCategories || {});




    return (
        <div className="home-page">
            <Carousel />
            {user || userFromStorage ? (
                <h2>ברוך הבא, {userFromStorage.name}</h2>
            ) : ""}

            <div className="category-section">
                {/* הצגת קטגוריות בצורה בטוחה */}
                {categoryArray.length > 0 ? (
                    <Category title={categories.companyName} subcategories={companyCategories} />
                ) : (
                    <p>אין קטגוריות זמינות.</p>
                )}
            </div>
        </div>
    );
};

export default HomePage;

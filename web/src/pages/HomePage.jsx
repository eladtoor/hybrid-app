import React from 'react';
import { useSelector } from 'react-redux';
import '../styles/HomePage.css';
import Carousel from '../components/Carousel';
import Category from '../components/Category';
import { useNavigate } from 'react-router-dom';

const HomePage = ({ products }) => {
    const loadingCategories = useSelector((state) => state.categories.loading);
    const loadingProducts = useSelector((state) => state.products.loading);
    const categories = useSelector((state) => state.categories.categories);

    const navigate = useNavigate();
    const user = useSelector((state) => state.user?.user);

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <div className="home-page">
            <Carousel />
            {/* Welcome message or login button */}
            {user ? (
                <h2 className='welcome'>ברוך הבא {user.name}</h2>
            ) : (
                <button className="login-button" onClick={handleLoginClick}>
                    התחבר עכשיו
                </button>
            )}

            {/* Categories Section */}
            <div className="category-section">
                {loadingCategories ? (
                    <p>טוען קטגוריות...</p>
                ) : categories?.companyCategories ? (
                    <Category title={categories.companyName} subcategories={categories.companyCategories} />
                ) : (
                    <p>אין קטגוריות זמינות.</p>
                )}
            </div>

            {/* Products Section */}
            <div className="product-section">
                {loadingProducts ? (
                    <p>טוען מוצרים...</p>
                ) : products?.length > 0 ? (
                    products.map((product) => (
                        <div key={product._id}>
                            {/* Customize product display */}
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

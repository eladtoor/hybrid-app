import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Carousel from '../components/Carousel';
import Category from '../components/Category';
import RecommendedProducts from '../components/RecommendedProducts';

const HomePage = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user?.user);
    const loadingCategories = useSelector((state) => state.categories.loading);
    const categories = useSelector((state) => state.categories.categories);

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <div className="mt-28 bg-gray-100 min-h-screen">
            {/* מרווח נוסף כדי להוריד את הקרוסלה */}
            <div className="w-full">
                <Carousel />
            </div>

            {/* הודעת ברוך הבא או התחברות */}
            <div className="flex justify-center items-center my-10">
                {user ? (
                    <h2 className="text-2xl font-bold text-gray-800">
                        ברוך הבא {user.name}
                    </h2>
                ) : (
                    <button
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300"
                        onClick={handleLoginClick}
                    >
                        התחבר עכשיו
                    </button>
                )}
            </div>

            {/* קטגוריות */}
            <div className="container mx-auto px-4">
                {loadingCategories ? (
                    <p className="text-center text-gray-700">טוען קטגוריות...</p>
                ) : categories?.companyCategories ? (
                    <Category title={categories.companyName} subcategories={categories.companyCategories} />
                ) : (
                    <p className="text-center text-gray-700">אין קטגוריות זמינות.</p>
                )}
            </div>

            {/* מוצרים מומלצים */}
            <div className="mt-20">
                <RecommendedProducts />
            </div>
        </div>
    );
};

export default HomePage;

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Carousel from '../components/Carousel';
import Category from '../components/Category';
import RecommendedProducts from '../components/RecommendedProducts';
import AboutUs from '../components/AboutUs';
import QuickCart from '../components/QuickCart';
import { FiShoppingCart } from 'react-icons/fi';
import DiscountedProducts from '../components/DiscountedProducts';
import StatsCounters from '../components/StatsCounters';



const HomePage = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user?.user);
    const loadingCategories = useSelector((state) => state.categories.loading);
    const categories = useSelector((state) => state.categories.categories);
    const [isQuickCartOpen, setIsQuickCartOpen] = useState(false);

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <div className="sm:mt-32 mt-24 min-h-screen relative">

            <div className="w-full mb-8 ">
                <Carousel />
            </div>

            <StatsCounters>
                <div className="absolute  left-1/2 transform -translate-x-1/2 sm:pt-4 ">
                    {user ? (
                        <h2 className="text-2xl font-bold text-gray-900 ">
                            ברוך הבא {user.name}
                        </h2>
                    ) : (
                        <button
                            className="bg-gray-900 hover:bg-primary text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 mt-3 sm:mt-0"
                            onClick={handleLoginClick}
                        >
                            התחבר עכשיו
                        </button>
                    )}
                </div>
            </StatsCounters>





            {/* אייקון צף לפתיחת עגלה מהירה מעל כפתור הוואטסאפ */}
            {user && (
                <div className="fixed bottom-24 right-5 flex flex-col items-center gap-4 z-50">
                    <div
                        className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-green-700 transition"
                        onClick={() => setIsQuickCartOpen(true)}
                    >
                        <FiShoppingCart size={32} />
                    </div>
                </div>
            )}

            {/* מודל של עגלה מהירה */}
            {isQuickCartOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
                        <button
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl"
                            onClick={() => setIsQuickCartOpen(false)}
                        >
                            ×
                        </button>
                        <QuickCart />
                    </div>
                </div>
            )}





            <div className="container mx-auto px-4 py-6">
                {/* מרכז המסך - קטגוריות */}
                <div className="w-full bg-white shadow-lg rounded-lg p-6">
                    {loadingCategories ? (
                        <p className="text-center text-gray-700">טוען קטגוריות...</p>
                    ) : categories?.companyCategories ? (
                        <Category title={categories.companyName} subcategories={categories.companyCategories} />
                    ) : (
                        <p className="text-center text-gray-700">אין קטגוריות זמינות.</p>
                    )}
                </div>
                {/* אודותינו */}
                <AboutUs />
                {/* מוצרים מומלצים */}
                {/* מוצרים בהנחה */}
                {console.log(user)
                }
                {user && user.productDiscounts?.length > 0 ? (
                    <DiscountedProducts discountedProducts={user.productDiscounts} />
                ) : (
                    <RecommendedProducts />
                )}
            </div>



        </div>
    );
};

export default HomePage;

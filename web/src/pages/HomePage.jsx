import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../styles/HomePage.css';
import Carousel from '../components/Carousel';
import Category from '../components/Category';
import { clearLogoutMessage } from '../reducers/userReducer';

const HomePage = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user); // נשלוף את המידע מה-Redux
    const name = user ? user.name : ''; // נשתמש במייל במקום בשם
    const logoutSuccess = useSelector((state) => state.user.logoutSuccess);

    useEffect(() => {
        if (logoutSuccess) {
            setTimeout(() => {
                dispatch(clearLogoutMessage());
            }, 3000); // ההודעה תעלם אחרי 3 שניות
        }
    }, [logoutSuccess, dispatch]);

    const buildingMaterialsSubcategories = [
        { name: 'בלוקים', image: '/product1.png' },
        { name: 'מלט', image: '/product2.png' },
        { name: 'טיח', image: '/product3.png' }
    ];

    const paintSubcategories = [
        { name: 'צבע קירות', image: '/product1.png' },
        { name: 'צבע עץ', image: '/product2.png' },
        { name: 'צבע מתכת', image: '/product3.png' },
        { name: 'צבע מתכת', image: '/product3.png' }
    ];

    const plumbingSubcategories = [
        { name: 'צנרת', image: '/product1.png' },
        { name: 'ברזים', image: '/product2.png' },
        { name: 'משאבות מים', image: '/product3.png' },
        { name: 'צבע מתכת', image: '/product3.png' },
        { name: 'צבע מתכת', image: '/product3.png' }
    ];

    return (
        <div className="home-page">
            <Carousel />

            {/* הצגת כתובת המייל שהוזנה מגוגל */}
            {name ? (
                <h2 style={{ textAlign: 'center', fontSize: '2.5rem', margin: '20px 0' }}>
                    ברוך הבא {name}!
                </h2>
            ) : logoutSuccess && (
                <h2 style={{ textAlign: 'center', fontSize: '2.5rem', margin: '20px 0' }}>
                    התנתקת בהצלחה
                </h2>
            )}

            <div className="category-section">
                <Category title="חומרי בניין" subcategories={buildingMaterialsSubcategories} />
                <Category title="צבעים" subcategories={paintSubcategories} />
                <Category title="אינסטלציה" subcategories={plumbingSubcategories} />
            </div>
        </div>
    );
};

export default HomePage;

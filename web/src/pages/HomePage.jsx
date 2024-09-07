import React from 'react';
import { useSelector } from 'react-redux';
import '../styles/HomePage.css';
import Carousel from '../components/Carousel';
import Category from '../components/Category';


const HomePage = () => {
    const { name } = useSelector((state) => state.user)
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
            {name && <h2 style={{ textAlign: 'center' }}>ברוך הבא, {name}!</h2>}

            <div className="category-section">
                <Category title="חומרי בניין" subcategories={buildingMaterialsSubcategories} />
                <Category title="צבעים" subcategories={paintSubcategories} />
                <Category title="אינסטלציה" subcategories={plumbingSubcategories} />
            </div>
        </div>
    );
};

export default HomePage;
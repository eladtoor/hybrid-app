import React, { useState } from 'react';
import '../styles/NavBar.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const NavBar = () => {
    const [searchVisible, setSearchVisible] = useState(false);

    const toggleSearch = () => {
        setSearchVisible(!searchVisible);
    };

    return (
        <header className="navbar-container">
            <div className="navbar">
                <a href="/" className="navbar-logo"><img src="/logo.png" alt="לוגו לבן גרופ" /></a>

                <ul className="navbar-categories">
                    <li className="dropdown">
                        <button className="dropdown-button">חומרי בניין</button>
                        <div className="dropdown-content">
                            <a href="/categories/electronics">אלקטרוניקה</a>
                            <a href="/categories/fashion">אופנה</a>
                            <a href="/categories/home">בית וגן</a>
                        </div>
                    </li>
                    <li className="dropdown">
                        <button className="dropdown-button">צבע שפכטל</button>
                        <div className="dropdown-content">
                            <a href="/categories/electronics">אלקטרוניקה</a>
                            <a href="/categories/fashion">אופנה</a>
                            <a href="/categories/home">בית וגן</a>
                        </div>
                    </li>
                    <li className="dropdown">
                        <button className="dropdown-button">אינסטלציה</button>
                        <div className="dropdown-content">
                            <a href="/categories/electronics">אלקטרוניקה</a>
                            <a href="/categories/fashion">אופנה</a>
                            <a href="/categories/home">בית וגן</a>
                        </div>
                    </li>
                    <li className="dropdown">
                        <button className="dropdown-button">כלי עבודה</button>
                        <div className="dropdown-content">
                            <a href="/categories/electronics">אלקטרוניקה</a>
                            <a href="/categories/fashion">אופנה</a>
                            <a href="/categories/home">בית וגן</a>
                        </div>
                    </li>
                </ul>

                <div className="navbar-icons">
                    <a href="#" onClick={toggleSearch}><i className="fa fa-search"></i></a>
                    <a href="/login"><i className="fa fa-user"></i></a>
                    <a href="/cart"><i className="fa fa-shopping-cart"></i></a>
                </div>
            </div>
            {searchVisible && (
                <div className="navbar-search">
                    <input type="text" placeholder="חפש מוצרים..." />
                    <button><i className="fa fa-search"></i></button>
                </div>
            )}
        </header>
    );
};

export default NavBar;


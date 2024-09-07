import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { logoutUser } from '../reducers/userReducer';
import '../styles/NavBar.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const NavBar = () => {
    const [searchVisible, setSearchVisible] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // קבלת המשתמש המחובר מ-Redux
    const currentUser = useSelector((state) => state.user.user);

    const toggleSearch = () => {
        setSearchVisible(!searchVisible);
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            dispatch(logoutUser());
    
            // מחיקת המידע מ-localStorage
            localStorage.removeItem('user');
    
            // ניתוב לדף הבית לאחר ההתנתקות
            navigate('/');
        } catch (error) {
            console.error('Error signing out: ', error);
        }
    };
    
    return (
        <header className="navbar-container">
            <div className="navbar">
                <a href="/" className="navbar-logo">
                    <img src="/logo.png" alt="לוגו לבן גרופ" />
                </a>

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

                    {currentUser ? (
                        <div 
                            className="user-dropdown" 
                            onMouseEnter={() => setDropdownVisible(true)}
                            onMouseLeave={() => setDropdownVisible(false)}
                        >
                            <a href="#"><i className="fa fa-user"></i></a>
                            {dropdownVisible && (
                                <div className="dropdown-content">
                                    <button onClick={() => navigate('/profile')}>הפרופיל שלי</button>
                                    <button onClick={handleSignOut}>התנתק</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <a href="/login"><i className="fa fa-user"></i></a>
                    )}

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

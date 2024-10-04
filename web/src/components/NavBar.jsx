import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { logoutUser } from '../redux/reducers/userReducer';
import '../styles/NavBar.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const NavBar = ({ categories }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchVisible, setSearchVisible] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const user = useSelector(state => state?.user?.user);
    const location = useLocation();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        }
    }, [user]);

    useEffect(() => {
        // סגירת תיבת החיפוש כאשר המשתמש עובר לעמוד החיפוש
        if (location.pathname === '/search') {
            setSearchVisible(false);
        }
    }, [location.pathname]);

    const toggleSearch = () => {
        setSearchVisible(!searchVisible);
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/search?query=${searchQuery.trim()}`); // העברה לדף תוצאות חיפוש
            setSearchVisible(false)
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch(); // העברה לדף תוצאות חיפוש בלחיצה על Enter
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            dispatch(logoutUser());
            localStorage.removeItem('user');
            navigate('/');
        } catch (error) {
            console.error('Error signing out: ', error);
        }
    };

    const handleCartClick = (e) => {
        e.preventDefault(); // מניעת ריענון העמוד
        navigate('/cart');
    };

    return (
        <header className="navbar-container">
            <div className="navbar">
                <Link to="/" className="navbar-logo">
                    <img src="/logo.png" alt="לוגו לבן גרופ" />
                </Link>

                <ul className="navbar-categories">
                    {/* כפתור טמבור עם דרופדאון של קטגוריות */}
                    {categories && categories.companyCategories && (
                        <li className="category-dropdown">
                            <button className="category-dropdown-button">{categories.companyName}</button>
                            <div className="category-dropdown-content">
                                {Object.values(categories.companyCategories).map((category, index) => (
                                    <Link key={index} to={`/${category.categoryName}/${category.categoryName}`}>
                                        {category.categoryName}
                                    </Link>
                                ))}
                            </div>
                        </li>
                    )}
                </ul>

                <div className="navbar-icons">
                    <a href="#" onClick={toggleSearch}>
                        <i className="fa fa-search"></i>
                    </a>

                    {(user || JSON.parse(localStorage.getItem('user'))) ? (
                        <div
                            className="user-dropdown"
                            onMouseEnter={() => setDropdownVisible(true)}
                            onMouseLeave={() => setDropdownVisible(false)}
                        >
                            <a href="#">
                                <i className="fa fa-user"></i>
                            </a>
                            {dropdownVisible && (
                                <div className="user-dropdown-content">
                                    <button onClick={() => navigate('/profile')}>הפרופיל שלי</button>
                                    <button onClick={handleSignOut}>התנתק</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login">
                            <i className="fa fa-user"></i>
                        </Link>
                    )}
                    <a href="/cart" onClick={handleCartClick}>
                        <i className="fa fa-shopping-cart"></i>
                    </a>
                </div>
            </div>

            {searchVisible && (
                <div className="navbar-search">
                    <input
                        type="text"
                        placeholder="חפש מוצרים..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyPress} // מאפשר חיפוש בלחיצה על Enter
                    />
                    <button onClick={handleSearch}>
                        <i className="fa fa-search"></i>
                    </button>
                </div>
            )}
        </header>
    );
};

export default NavBar;

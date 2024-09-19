import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Sync user data with local storage
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        }
    }, [user]);

    const toggleSearch = () => {
        setSearchVisible(!searchVisible);
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/search?query=${searchQuery.trim()}`); // העברה לדף תוצאות חיפוש
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

    return (
        <header className="navbar-container">
            <div className="navbar">
                <a href="/" className="navbar-logo">
                    <img src="/logo.png" alt="לוגו לבן גרופ" />
                </a>

                <ul className="navbar-categories">
                    {/* כפתור טמבור עם דרופדאון של קטגוריות */}
                    {categories && categories.companyCategories && (
                        <li className="dropdown">
                            <button className="dropdown-button">{categories.companyName}</button>
                            <div className="dropdown-content">
                                {Object.values(categories.companyCategories).map((category, index) => (
                                    <a key={index} href={`/${category.categoryName}`}>
                                        {category.categoryName}
                                    </a>
                                ))}
                            </div>
                        </li>
                    )}
                </ul>

                <div className="navbar-icons">
                    <a href="#" onClick={toggleSearch}>
                        <i className="fa fa-search"></i>
                    </a>
                    {user ? (
                        <div
                            className="user-dropdown"
                            onMouseEnter={() => setDropdownVisible(true)}
                            onMouseLeave={() => setDropdownVisible(false)}
                        >
                            <a href="#">
                                <i className="fa fa-user"></i>
                            </a>
                            {dropdownVisible && (
                                <div className="dropdown-content">
                                    <button onClick={() => navigate('/profile')}>הפרופיל שלי</button>
                                    <button onClick={handleSignOut}>התנתק</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <a href="/login">
                            <i className="fa fa-user"></i>
                        </a>
                    )}
                    <a href="/cart">
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

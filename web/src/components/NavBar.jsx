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
    const [userDropdownVisible, setUserDropdownVisible] = useState(false);
    const [adminDropdownVisible, setAdminDropdownVisible] = useState(false);
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
        if (location.pathname === '/search') {
            setSearchVisible(false);
        }
    }, [location.pathname]);

    const toggleSearch = () => {
        setSearchVisible(!searchVisible);
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/search?query=${searchQuery.trim()}`);
            setSearchVisible(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
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
        e.preventDefault();
        navigate('/cart');
    };

    return (
        <header className="navbar-container">
            <div className="navbar">
                <Link to="/" className="navbar-logo">
                    <img src="/logo.png" alt="לוגו לבן גרופ" />
                </Link>

                <ul className="navbar-categories">
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
                            onMouseEnter={() => setUserDropdownVisible(true)}
                            onMouseLeave={() => setUserDropdownVisible(false)}
                        >
                            <a href="#">
                                <i className="fa fa-user"></i>
                            </a>
                            {userDropdownVisible && (
                                <div className="user-dropdown-content">
                                    <button onClick={() => navigate('/profile')}>הפרופיל שלי</button>
                                    {user?.userType === 'סוכן' && (
                                        <button onClick={() => navigate('/agent-dashboard')}>ניהול לקוחות</button>
                                    )}
                                    <button onClick={handleSignOut}>התנתק</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login">
                            <i className="fa fa-user"></i>
                        </Link>
                    )}

                    {user?.isAdmin && (
                        <div
                            className="user-dropdown"
                            onMouseEnter={() => setAdminDropdownVisible(true)}
                            onMouseLeave={() => setAdminDropdownVisible(false)}
                        >
                            <a href="#">
                                <i className="fa fa-cogs"></i>
                            </a>
                            {adminDropdownVisible && (
                                <div className="user-dropdown-content">
                                    <button onClick={() => navigate('/admin-panel')}>עריכת מוצרים</button>
                                    <button onClick={() => navigate('/user-management')}>ניהול משתמשים</button>
                                </div>
                            )}
                        </div>
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
                        onKeyDown={handleKeyPress}
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

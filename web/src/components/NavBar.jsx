import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';


import { useDispatch, useSelector } from 'react-redux';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { logoutUser } from '../redux/reducers/userReducer';
import '../styles/NavBar.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const NavBar = () => {
    const categories = useSelector((state) => state.categories.categories);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchVisible, setSearchVisible] = useState(false);
    const [userDropdownVisible, setUserDropdownVisible] = useState(false);
    const [adminDropdownVisible, setAdminDropdownVisible] = useState(false);
    const user = useSelector(state => state?.user?.user);
    const location = useLocation();
    const [searchError, setSearchError] = useState('');
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);


    const navigate = useNavigate();
    const dispatch = useDispatch();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth > 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    useEffect(() => {
        console.log("🛠 Component received categories update:", categories);
    }, [categories]); // ✅ Log updates
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        }
    }, [user]);

    useEffect(() => {
        if (location.pathname !== '/search') {
            setSearchVisible(false);
        }
    }, [location.pathname]);


    const toggleSearch = () => {
        setSearchVisible(!searchVisible);
        setSearchError(''); // מנקה הודעות שגיאה כשהחיפוש נפתח מחדש
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            setSearchError("נא להזין מוצר");
            return;
        }
        setSearchError('');
        navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
        setSearchQuery(''); // ✅ מאפס את שדה החיפוש אחרי הניווט

        if (isDesktop) {
            setSearchVisible(false); // ✅ סוגר את שורת החיפוש רק בדסקטופ
        }
    };



    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch(e);
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
            <div className="navbar-grid">
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
                <button className="hamburger-menu" onClick={toggleMenu}>
                    ☰
                </button>
                <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
                    <span className="close-menu" onClick={toggleMenu}>✖</span>
                    <Link to="/" onClick={toggleMenu}>ראשי</Link>
                    <Link to="/search" onClick={toggleMenu}>חיפוש</Link>
                    <Link to="/profile" onClick={toggleMenu}>הפרופיל שלי</Link>
                    <Link to="/cart" onClick={toggleMenu}>העגלה שלי</Link>

                    {/* כפתור התנתקות */}
                    <Link to="/" onClick={async (e) => {
                        e.preventDefault(); // מניעת ניווט מיידי
                        await handleSignOut(); // ביצוע התנתקות
                        setIsMenuOpen(false); // סגירת התפריט
                    }}>
                        התנתק
                    </Link>
                </div>


                <div className="navbar-icons">
                    <a href="#" onClick={toggleSearch}>
                        <i className="fa fa-search icon-style"></i>
                    </a>

                    {(user || JSON.parse(localStorage.getItem('user'))) ? (
                        <div
                            className="user-dropdown"
                            onMouseEnter={() => setUserDropdownVisible(true)}
                            onMouseLeave={() => setUserDropdownVisible(false)}
                        >
                            <a href="#">
                                <i className="fa fa-user icon-style"></i>
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
                                <i className="fa fa-cogs icon-style"></i>
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
                        <i className="fa fa-shopping-cart icon-style"></i>
                    </a>
                </div>
            </div>

            {/* ✅ הצגת שורת החיפוש */}
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
                        <i className="fa fa-search  "></i>
                    </button>
                    {searchError && <p className="search-error ">{searchError}</p>}
                </div>

            )}
        </header>
    );
};

export default NavBar;

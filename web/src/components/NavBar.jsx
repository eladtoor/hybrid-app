import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { logoutUser } from '../redux/reducers/userReducer';
import '@fortawesome/fontawesome-free/css/all.min.css';

const NavBar = () => {
    const categories = useSelector((state) => state.categories.categories);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchVisible, setSearchVisible] = useState(false);
    const user = useSelector(state => state?.user?.user);
    const location = useLocation();
    const [searchError, setSearchError] = useState('');
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
    const [loadingUser, setLoadingUser] = useState(true);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(() => setLoadingUser(false));
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth > 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        setSearchVisible(false); // תמיד סוגר
    }, [location.pathname, location.search]); // מאזין גם ל-query string


    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            setSearchError("נא להזין מוצר");
            return;
        }
        setSearchError('');
        navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
        setSearchQuery('');
        if (isDesktop) setSearchVisible(false);
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
        <header className="fixed top-0 w-full z-40 shadow-lg text-xl bg-gray-900 overflow-visible">
            <div className="flex items-center justify-between px-4 md:px-16 py-4 mx-auto relative">
                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white text-2xl p-2"
                    onClick={toggleMenu}
                >
                    <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                </button>


                {/* Logo */}
                <div className="flex justify-start">
                    <Link to="/" className="flex items-center gap-4">
                        <img src="/logo.png" alt="לוגו" className="h-12 md:h-20 object-contain bg-white rounded-lg shadow-md px-2 py-1" />
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex justify-center">
                    <div className="relative group">
                        <button className="font-bold text-5xl text-white hover:text-red-600 transition">
                            {categories.companyName}
                        </button>
                        <div className="absolute top-full left-1/4 transform -translate-x-1/2 hidden group-hover:block bg-gray-900/90 backdrop-blur-sm p-5 shadow-lg rounded-md z-50 border">
                            <div className="flex flex-row">
                                {Object.values(categories.companyCategories).map((category, idx) => (
                                    <Link
                                        key={idx}
                                        to={`/${category.categoryName}/${category.categoryName}`}
                                        className="text-lg text-white hover:bg-black px-4 py-3 rounded transition-colors border border-transparent hover:border-gray-300"
                                    >
                                        {category.categoryName}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Desktop Icons */}
                <div className="hidden md:flex justify-end items-center gap-6">
                    <button onClick={() => setSearchVisible(!searchVisible)} className="text-white hover:text-red-600 text-2xl">
                        <i className="fa fa-search"></i>
                    </button>
                    {!loadingUser && user ? (
                        <div className="relative group">
                            <button className="text-white hover:text-red-600 text-2xl">
                                <i className="fa fa-user"></i>
                            </button>
                            <div className="absolute top-full left-1/4 transform -translate-x-1/2 hidden group-hover:block bg-gray-900/90 backdrop-blur-sm p-5 shadow-lg rounded-md z-50 border">
                                <div className="flex flex-col gap-4">
                                    <button onClick={() => navigate('/profile')} className="text-lg text-white hover:bg-black px-4 py-3 rounded transition-colors border border-transparent hover:border-gray-300">
                                        הפרופיל שלי
                                    </button>
                                    {user.userType === 'סוכן' && (
                                        <button onClick={() => navigate('/agent-dashboard')} className="text-lg text-white hover:bg-black px-4 py-3 rounded transition-colors border border-transparent hover:border-gray-300">
                                            ניהול לקוחות
                                        </button>
                                    )}
                                    <button onClick={handleSignOut} className="text-lg text-white hover:bg-black px-4 py-3 rounded transition-colors border border-transparent hover:border-gray-300">
                                        התנתק
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="text-white hover:text-red-600 text-2xl">
                            <i className="fa fa-user"></i>
                        </Link>
                    )}
                    {user?.isAdmin && (
                        <div className="relative group">
                            <button className="text-white hover:text-red-600 text-2xl">
                                <i className="fa fa-cogs"></i>
                            </button>
                            <div className="absolute top-full left-1/4 transform -translate-x-1/2 hidden group-hover:block bg-gray-900/90 backdrop-blur-sm p-5 shadow-lg rounded-md z-50 border">
                                <div className="flex flex-col gap-4">
                                    <button onClick={() => navigate('/admin-panel')} className="text-lg text-white hover:bg-black px-4 py-3 rounded transition-colors border border-transparent hover:border-gray-300">
                                        עריכת מוצרים
                                    </button>
                                    <button onClick={() => navigate('/user-management')} className="text-lg text-white hover:bg-black px-4 py-3 rounded transition-colors border border-transparent hover:border-gray-300">
                                        ניהול משתמשים
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    <button onClick={() => navigate('/cart')} className="text-white hover:text-red-600 text-2xl">
                        <i className="fa fa-shopping-cart"></i>
                    </button>
                </div>

                {/* Mobile Icons */}
                <div className="flex md:hidden items-center gap-4">
                    <button onClick={() => setSearchVisible(!searchVisible)} className="text-white text-xl">
                        <i className="fa fa-search"></i>
                    </button>
                    <button onClick={() => navigate('/cart')} className="text-white text-xl">
                        <i className="fa fa-shopping-cart"></i>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden fixed top-0 right-0 h-full w-full bg-black/50 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={toggleMenu}>
                <div
                    className={`absolute right-0 top-20 h-[calc(100%-5rem)] w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}
                    onClick={(e) => e.stopPropagation()}
                >

                    <button onClick={toggleMenu} className="md:hidden text-white text-2xl p-2">
                        <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                    </button>


                    <div className="flex flex-col gap-4">
                        <Link
                            to="/"
                            className=" text-gray-900 font-bold bg-gray-100 border-b border-white py-3 px-4 text-center hover:bg-blue-900 hover:text-white transition-colors duration-300"

                            onClick={toggleMenu}
                        >
                            דף הבית
                        </Link>
                        <div className="text-2xl font-bold text-center text-gray-800 border-b-2 border-gray-300 pb-4">{categories.companyName}</div>
                        <div className="border-b border-gray-200 pb-4">

                            {Object.values(categories.companyCategories).map((category, idx) => (
                                <Link
                                    key={idx}
                                    to={`/${category.categoryName}/${category.categoryName}`}
                                    className="block w-full text-lg text-gray-900 font-bold bg-gray-100 border-b border-white py-3 px-4 text-center hover:bg-blue-900 hover:text-white transition-colors duration-300"

                                    onClick={toggleMenu}
                                >
                                    {category.categoryName}
                                </Link>
                            ))}
                        </div>
                        <div className="flex flex-col ">

                            {!loadingUser && user ? (
                                <>
                                    <Link to="/profile" onClick={toggleMenu} className="block w-full text-lg text-gray-900 font-bold bg-gray-100 border-b border-white py-3 px-4 text-center hover:bg-blue-900 hover:text-white transition-colors duration-300"
                                    >
                                        הפרופיל שלי
                                    </Link>
                                    {user.userType === 'סוכן' && (
                                        <Link to="/agent-dashboard" onClick={toggleMenu} className="block w-full text-lg text-gray-900 font-bold bg-gray-100 border-b border-white py-3 px-4 text-center hover:bg-blue-900 hover:text-white transition-colors duration-300"
                                        >
                                            ניהול לקוחות
                                        </Link>
                                    )}
                                    {user.isAdmin && (
                                        <>
                                            <Link to="/admin-panel" onClick={toggleMenu} className="block w-full text-lg text-gray-900 font-bold bg-gray-100 border-b border-white py-3 px-4 text-center hover:bg-blue-900 hover:text-white transition-colors duration-300"
                                            >
                                                עריכת מוצרים
                                            </Link>
                                            <Link to="/user-management" onClick={toggleMenu} className="block w-full text-lg text-gray-900 font-bold bg-gray-100 border-b border-white py-3 px-4 text-center hover:bg-blue-900 hover:text-white transition-colors duration-300"
                                            >
                                                ניהול משתמשים
                                            </Link>
                                        </>
                                    )}
                                    <button
                                        onClick={async () => {
                                            await handleSignOut();
                                            toggleMenu();
                                        }}
                                        className="block w-full text-lg text-gray-900 font-bold bg-gray-100 border-b border-white py-3 px-4 text-center hover:bg-blue-900 hover:text-white transition-colors duration-300"

                                    >
                                        התנתק
                                    </button>
                                </>
                            ) : (
                                <Link to="/login" onClick={toggleMenu} className="block w-full text-lg text-gray-900 font-bold bg-gray-100 border-b border-white py-3 px-4 text-center hover:bg-blue-900 hover:text-white transition-colors duration-300"
                                >
                                    התחברות
                                </Link>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {/* Search Bar */}
            {searchVisible && (
                <div className="flex justify-center items-center gap-4 py-4 px-4 md:px-0 md:py-6 bg-gray-100 border-t">
                    <input
                        type="text"
                        placeholder="חפש מוצרים..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                        className="flex-1 md:w-96 md:flex-none px-4 md:px-6 py-2 md:py-3 rounded-full border border-gray-300 focus:ring-4 focus:ring-red-600 text-lg"
                    />
                    <button onClick={handleSearch} className="bg-red-600 text-white p-3 md:p-4 rounded-full text-xl md:text-2xl">
                        <i className="fa fa-search"></i>
                    </button>
                    {searchError && <p className="text-red-600 text-lg absolute top-full left-1/2 transform -translate-x-1/2">{searchError}</p>}
                </div>
            )}
        </header>
    );
};

export default NavBar;
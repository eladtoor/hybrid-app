import React from 'react';
import '../styles/Footer.css'; // וודא שיש לך את קובץ ה-CSS
import { FaPhone, FaEnvelope, FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">

                {/* עמודת יצירת קשר */}
                <div className="footer-section">
                    <h3> צור קשר 📞</h3>
                    <p><FaPhone /> 050-5342813</p>
                    <p><FaEnvelope /> <a href="mailto:Lavan1414@gmail.com">Lavan1414@gmail.com</a></p>
                </div>

                {/* עמודת קישורים */}
                <div className="footer-section">
                    <h3> קישורים מהירים 🔗</h3>
                    <ul>
                        <li><a href="/">דף הבית</a></li>
                        <li><a href="/cart">העגלה שלי</a></li>
                        <li><a href="/profile">הפרופיל שלי</a></li>
                        <li><a href="/contact">צור קשר</a></li>
                    </ul>
                </div>

                {/* עמודת רשתות חברתיות */}
                <div className="footer-section">
                    <h3> עקבו אחרינו 📱</h3>
                    <div className="social-icons">
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                            <FaFacebook />
                        </a>
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                            <FaInstagram />
                        </a>
                        <a href="https://wa.me/0505342813" target="_blank" rel="noopener noreferrer">
                            <FaWhatsapp />
                        </a>
                    </div>
                </div>
            </div>
            <p className="footer-bottom">&copy; 2025 Lavan Group. כל הזכויות שמורות.</p>
        </footer>
    );
};

export default Footer;
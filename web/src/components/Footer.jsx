import React from 'react';
import { FaPhone, FaEnvelope, FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-6 text-center">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* עמודת יצירת קשר */}
                <div className="flex flex-col items-center">
                    <h3 className="text-xl font-bold border-b-2 border-yellow-400 pb-1 mb-3">צור קשר 📞</h3>
                    <p className="text-lg flex items-center gap-2"><FaPhone /> 050-5342813</p>
                    <p className="text-lg flex items-center gap-2">
                        <FaEnvelope />
                        <a href="mailto:Lavan1414@gmail.com" className="hover:text-yellow-400 transition">Lavan1414@gmail.com</a>
                    </p>
                </div>

                {/* עמודת קישורים */}
                <div className="flex flex-col items-center">
                    <h3 className="text-xl font-bold border-b-2 border-yellow-400 pb-1 mb-3">קישורים מהירים 🔗</h3>
                    <ul className="space-y-2">
                        <li><a href="/" className="text-lg hover:text-yellow-400 transition">דף הבית</a></li>
                        <li><a href="/cart" className="text-lg hover:text-yellow-400 transition">העגלה שלי</a></li>
                        <li><a href="/profile" className="text-lg hover:text-yellow-400 transition">הפרופיל שלי</a></li>
                    </ul>
                </div>

                {/* עמודת רשתות חברתיות */}
                <div className="flex flex-col items-center">
                    <h3 className="text-xl font-bold border-b-2 border-yellow-400 pb-1 mb-3">עקבו אחרינו 📱</h3>
                    <div className="flex gap-4 text-3xl">
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 hover:scale-110 transition"><FaFacebook /></a>
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 hover:scale-110 transition"><FaInstagram /></a>
                        <a href="https://wa.me/0505342813" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 hover:scale-110 transition"><FaWhatsapp /></a>
                    </div>
                </div>
            </div>

            {/* זכויות יוצרים */}
            <p className="text-sm text-gray-400 mt-6 border-t border-gray-700 pt-3">
                &copy; 2025 Lavan Group. כל הזכויות שמורות.
            </p>
        </footer>
    );
};

export default Footer;

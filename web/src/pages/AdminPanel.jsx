import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
    const navigate = useNavigate();
    const userInfo = useSelector((state) => state.user?.user);
    const products = useSelector((state) => state.products.products);

    const [showForm, setShowForm] = useState(false);
    const [newProduct, setNewProduct] = useState({
        מזהה: '',
        סוג: 'simple', // ברירת המחדל היא simple
        'מק"ט': '',
        שם: '',
        'תיאור קצר': '',
        תיאור: '',
        'מחיר מבצע': '',
        'מחיר רגיל': '',
        קטגוריות: '',
        תמונות: '',
        variations: []
    });

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            alert('Access Denied. Admins Only.');
            navigate('/login');
        }
    }, [userInfo, navigate]);

    const handleAddProduct = () => {
        setShowForm(true);
    };

    const handleCloseModal = () => {
        setShowForm(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value
        }));
    };

    const handleRadioChange = (e) => {
        setNewProduct((prevProduct) => ({
            ...prevProduct,
            סוג: e.target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('מוצר חדש:', newProduct);
        handleCloseModal();
    };

    return (
        <div className="admin-panel">
            <h1>פאנל ניהול</h1>
            <button className="admin-button" onClick={handleAddProduct}>הוסף מוצר חדש</button>

            {showForm && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <h2>הוסף מוצר חדש</h2>
                        <form onSubmit={handleSubmit}>
                            <label>
                                מזהה:
                                <input type="text" name="מזהה" value={newProduct.מזהה} onChange={handleInputChange} required />
                            </label>
                            <label >
                                סוג:
                                <div className="radio-group">
                                    <label>
                                        <input
                                            type="radio"
                                            name="סוג"
                                            value="simple"
                                            checked={newProduct.סוג === 'simple'}
                                            onChange={handleRadioChange}
                                        />
                                        Simple
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="סוג"
                                            value="variable"
                                            checked={newProduct.סוג === 'variable'}
                                            onChange={handleRadioChange}
                                        />
                                        Variable
                                    </label>
                                </div>
                            </label>
                            <label>
                                מק"ט:
                                <input type="text" name='מק"ט' value={newProduct['מק"ט']} onChange={handleInputChange} required />
                            </label>
                            <label>
                                שם:
                                <input type="text" name="שם" value={newProduct.שם} onChange={handleInputChange} required />
                            </label>
                            <label>
                                תיאור קצר:
                                <textarea name="תיאור קצר" value={newProduct['תיאור קצר']} onChange={handleInputChange} />
                            </label>
                            <label>
                                תיאור:
                                <textarea name="תיאור קצר" value={newProduct['תיאור קצר']} onChange={handleInputChange} />
                            </label>
                            <label>
                                מחיר רגיל:
                                <input type="text" name="מחיר רגיל" value={newProduct['מחיר רגיל']} onChange={handleInputChange} />
                            </label>
                            <label>
                                מחיר מבצע:
                                <input type="text" name="מחיר מבצע" value={newProduct['מחיר מבצע']} onChange={handleInputChange} />
                            </label>

                            <label>
                                קטגוריות:
                                <input type="text" name="קטגוריות" value={newProduct.קטגוריות} onChange={handleInputChange} />
                            </label>
                            <label>
                                תמונות:
                                <input type="text" name="תמונות" value={newProduct.תמונות} onChange={handleInputChange} />
                            </label>
                            <button type="submit">שמור מוצר</button>
                        </form>
                    </div>
                </div>
            )}
            <table className="admin-table">
                <thead>
                    <tr>
                        <th className="admin-th">תמונה</th>
                        <th className="admin-th">מזהה</th>
                        <th className="admin-th">שם מוצר</th>
                        <th className="admin-th">מק"ט</th>
                        <th className="admin-th">סוג</th>
                        <th className="admin-th">פעולות</th>
                    </tr>
                </thead>
                <tbody>
                    {products?.map((product) => (
                        <tr key={product._id}>
                            <td className="admin-td"><img src={product["תמונות"]} alt={product.name} className="admin-img" /></td>
                            <td className="admin-td">{product.מזהה}</td>
                            <td className="admin-td">{product["שם"]}</td>
                            <td className="admin-td">{product['מק"ט']}</td>
                            <td className="admin-td">{product.סוג}</td>
                            <td className="admin-td">
                                <button >ערוך</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPanel;
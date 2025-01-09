import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import '../styles/AgentDashboard.css';

const AgentDashboard = () => {
    const [referredUsers, setReferredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [productDiscounts, setProductDiscounts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const agent = useSelector((state) => state.user.user); // Assume user info is in Redux
    const products = useSelector((state) => state.products.products); // Assume products are in Redux

    useEffect(() => {
        const fetchReferredUsers = async () => {
            if (!agent || !agent.uid) return;
            try {
                const usersCollection = collection(db, 'users');
                const q = query(usersCollection, where('referredBy', '==', agent.uid));
                const userDocs = await getDocs(q);
                const usersData = userDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setReferredUsers(usersData);
            } catch (error) {
                console.error('Error fetching referred users:', error);
            }
        };

        fetchReferredUsers();
    }, [agent]);

    useEffect(() => {
        const filtered = products
            .filter(product =>
                product['שם'].toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.מזהה.toString().includes(searchQuery)
            )
            .slice(0, 3);
        setFilteredProducts(filtered);
    }, [searchQuery, products]);

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setProductDiscounts(user.productDiscounts || []);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedUser(null);
        setProductDiscounts([]);
        setSearchQuery('');
        setFilteredProducts([]);
    };

    const handleAddProductDiscount = (product) => {
        if (!productDiscounts.find(discount => discount.productId === product._id)) {
            setProductDiscounts((prevDiscounts) => [
                ...prevDiscounts,
                { productId: product._id, productName: product['שם'], discount: 0 }
            ]);
        }
        setSearchQuery('');
    };

    const handleRemoveProductDiscount = (index) => {
        const updatedDiscounts = [...productDiscounts];
        updatedDiscounts.splice(index, 1);
        setProductDiscounts(updatedDiscounts);
    };

    const handleProductDiscountChange = (index, field, value) => {
        const updatedDiscounts = [...productDiscounts];
        updatedDiscounts[index][field] = value;
        setProductDiscounts(updatedDiscounts);
    };

    const handleSaveChanges = async () => {
        if (selectedUser) {
            const userRef = doc(db, 'users', selectedUser.id);
            try {
                await updateDoc(userRef, { productDiscounts });
                const updatedUsers = referredUsers.map(user =>
                    user.id === selectedUser.id
                        ? { ...user, productDiscounts }
                        : user
                );
                setReferredUsers(updatedUsers);
                closeEditModal();
            } catch (error) {
                console.error('Error saving changes:', error);
            }
        }
    };

    return (
        <div className="agent-dashboard">
            <h1>משתמשים שנרשמו דרך הלינק שלך</h1>
            <table className="user-table">
                <thead>
                    <tr>
                        <th>שם משתמש</th>
                        <th>אימייל</th>
                        <th>טלפון</th>
                        <th>פעולות</th>
                    </tr>
                </thead>
                <tbody>
                    {referredUsers.map(user => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone || 'לא זמין'}</td>
                            <td>
                                <button onClick={() => handleEditUser(user)}>עריכה</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isEditModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeEditModal}>&times;</span>
                        <h2>עריכת הנחות - {selectedUser?.name}</h2>
                        <div className="product-discount-section">
                            <input
                                type="text"
                                placeholder="חפש מוצר לפי מזהה/שם"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-bar"
                            />
                            {searchQuery && (
                                <ul className="search-results">
                                    {filteredProducts.map((product) => (
                                        <li key={product._id} onClick={() => handleAddProductDiscount(product)}>
                                            <img src={product["תמונות"]} alt={product["שם"]} className="product-thumbnail" />
                                            <span>{product["שם"]} ({product.מזהה})</span>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {productDiscounts.map((discount, index) => (
                                <div key={index} className="form-group product-discount">
                                    <p>מוצר: {discount.productName} ({discount.productId})</p>
                                    <label>
                                        אחוז הנחה:
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={discount.discount}
                                            onChange={(e) =>
                                                handleProductDiscountChange(index, 'discount', e.target.value)
                                            }
                                        />
                                    </label>
                                    <button onClick={() => handleRemoveProductDiscount(index)}>הסר</button>
                                </div>
                            ))}
                        </div>
                        <button onClick={handleSaveChanges}>שמור שינויים</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgentDashboard;

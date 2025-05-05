import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { useSelector } from 'react-redux';

const AgentDashboard = () => {
    const [referredUsers, setReferredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [productDiscounts, setProductDiscounts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const agent = useSelector((state) => state.user.user);
    const products = useSelector((state) => state.products.products);

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
        <div className="max-w-4xl mx-auto mt-32 p-4 sm:p-6 md:p-10 bg-white shadow-2xl rounded-3xl">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
                משתמשים שנרשמו דרך הלינק שלך
            </h1>
            <div className="overflow-x-auto">
                <table className="w-full table-auto border border-gray-300 mb-6 sm:mb-10 text-sm sm:text-base">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 sm:p-3 border">שם משתמש</th>
                            <th className="p-2 sm:p-3 border">אימייל</th>
                            <th className="p-2 sm:p-3 border">טלפון</th>
                            <th className="p-2 sm:p-3 border">פעולות</th>
                        </tr>
                    </thead>
                    <tbody>
                        {referredUsers.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="p-2 sm:p-3 border text-center">{user.name}</td>
                                <td className="p-2 sm:p-3 border text-center">{user.email}</td>
                                <td className="p-2 sm:p-3 border text-center">{user.phone || 'לא זמין'}</td>
                                <td className="p-2 sm:p-3 border text-center">
                                    <button
                                        onClick={() => handleEditUser(user)}
                                        className="bg-gray-900 text-white px-3 sm:px-4 py-1 rounded hover:bg-primary transition text-xs sm:text-sm"
                                    >
                                        עריכה
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen p-4 sm:p-6">
                        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-md sm:max-w-3xl relative">
                            <button
                                onClick={closeEditModal}
                                className="absolute top-3 left-3 text-xl sm:text-2xl text-gray-600 hover:text-black"
                            >
                                &times;
                            </button>
                            <div className="space-y-4 sm:space-y-6">
                                <h2 className="text-lg sm:text-2xl font-bold text-center">
                                    עריכת הנחות - {selectedUser?.name}
                                </h2>

                                <input
                                    type="text"
                                    placeholder="חפש מוצר לפי מזהה/שם"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full border p-2 sm:p-3 rounded-lg text-sm sm:text-base"
                                />

                                {searchQuery && (
                                    <ul className="bg-gray-50 border border-gray-300 rounded-lg max-h-40 overflow-y-auto divide-y text-sm sm:text-base">
                                        {filteredProducts.map((product) => (
                                            <li
                                                key={product._id}
                                                onClick={() => handleAddProductDiscount(product)}
                                                className="p-2 sm:p-3 flex items-center cursor-pointer hover:bg-blue-100"
                                            >
                                                <img
                                                    src={product["תמונות"]}
                                                    alt={product["שם"]}
                                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded object-cover mr-2 sm:mr-3"
                                                />
                                                <span>{product["שם"]} ({product.מזהה})</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                <div className="space-y-3 sm:space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                                    {productDiscounts.map((discount, index) => (
                                        <div key={index} className="border p-3 sm:p-4 rounded-lg bg-gray-50">
                                            <p className="mb-2 sm:mb-3 text-sm sm:text-base">
                                                מוצר: <strong>{discount.productName}</strong> ({discount.productId})
                                            </p>
                                            <div className="flex items-center space-x-2 sm:space-x-3">
                                                <label className="w-24 sm:w-32 text-sm sm:text-base">אחוז הנחה:</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={discount.discount}
                                                    onChange={(e) =>
                                                        handleProductDiscountChange(index, 'discount', e.target.value)
                                                    }
                                                    className="border p-2 rounded-lg w-full text-sm sm:text-base"
                                                />
                                                <button
                                                    onClick={() => handleRemoveProductDiscount(index)}
                                                    className="text-red-500 hover:text-red-700 text-sm sm:text-base"
                                                >
                                                    הסר
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={handleSaveChanges}
                                    className="w-full mt-4 bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-green-700 transition shadow text-sm sm:text-base"
                                >
                                    שמור שינויים
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgentDashboard;

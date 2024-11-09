import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import '../styles/UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserPurchases, setSelectedUserPurchases] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserName, setSelectedUserName] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const userDocs = await getDocs(usersCollection);
        const usersData = userDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleEditUser = (userId) => {
    console.log(`Editing user with ID: ${userId}`);
    // כאן תוכל להוסיף את הלוגיקה לעריכת משתמשים
  };

  const handleViewPurchaseHistory = async (userId, userName) => {
    try {
      const purchasesCollection = collection(db, `users/${userId}/purchases`);
      const purchaseDocs = await getDocs(purchasesCollection);
      const purchasesData = purchaseDocs.docs.map(doc => doc.data());

      setSelectedUserPurchases(purchasesData || []); // הגדרת ברירת מחדל של מערך ריק
      setSelectedUserName(userName);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching purchase history:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUserPurchases([]);
  };

  return (
    <div className="user-management">
      <h1>ניהול משתמשים</h1>
      <table className="user-table">
        <thead>
          <tr>
            <th>שם משתמש</th>
            <th>אימייל</th>
            <th>טלפון</th>
            <th>כתובת</th>
            <th>סטטוס</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone || 'לא זמין'}</td>
              <td>{user.address || 'לא זמין'}</td>
              <td>{user.status || 'פעיל'}</td>
              <td className="action-buttons">
                <button onClick={() => handleEditUser(user.id)}>עריכה</button>
                <button onClick={() => handleViewPurchaseHistory(user.id, user.name)}>הצג היסטוריית רכישות</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>היסטוריית רכישות עבור {selectedUserName}</h2>
            {selectedUserPurchases.length > 0 ? (
              <ul className="purchase-list">
                {selectedUserPurchases.map((purchase, index) => (
                  <li key={index}>
                    <p>תאריך רכישה: {purchase.date}</p>
                    <p>סכום: ₪{purchase.totalPrice}</p>
                    <p>פריטים:
                      {purchase.cartItems.map(item => <p>
                        <h3>{item.name}</h3>
                        <p> כמות: {item.quantity}</p>
                        <p> מחיר ליחידה: {item.price}</p>


                      </p>)}
                    </p>
                    <ul>
                      {(purchase.items || []).map((item, itemIndex) => (
                        <li key={itemIndex}>
                          {item.name} - כמות: {item.quantity}, מחיר ליחידה: ₪{item.unitPrice}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            ) : (
              <p>אין רכישות להצגה עבור משתמש זה.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
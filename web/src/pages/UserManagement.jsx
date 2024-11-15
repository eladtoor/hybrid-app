import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../styles/UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userType, setUserType] = useState('regular');
  const navigate = useNavigate();

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

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsAdmin(user.isAdmin);
    setUserType(user.userType || 'regular');
    setIsEditModalOpen(true);
  };

  const handleViewPurchaseHistory = (userId, userName) => {
    navigate(`/purchase-history/${userId}/${userName}`);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleSaveChanges = async () => {
    if (selectedUser) {
      const userRef = doc(db, 'users', selectedUser.id);
      try {
        await updateDoc(userRef, {
          isAdmin,
          userType,
        });
        setUsers(users.map(user =>
          user.id === selectedUser.id ? { ...user, isAdmin, userType } : user
        ));
        closeEditModal();
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
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
            <th>סוג משתמש</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone || 'לא זמין'}</td>
              <td>
                {user.address
                  ? [
                    user.address.city && `${user.address.city}`,
                    user.address.street && `${user.address.street}`,
                    user.address.apartment && `דירה ${user.address.apartment}`,
                    user.address.floor && `קומה ${user.address.floor}`,
                    user.address.entrance && `כניסה ${user.address.entrance}`
                  ]
                    .filter(Boolean)
                    .join(', ')
                  : 'לא זמין'}
              </td>
              <td>{user.userType === 'agent' ? 'סוכן' : 'רגיל'}</td>
              <td className="action-buttons">
                <button onClick={() => handleEditUser(user)}>עריכה</button>
                <button onClick={() => handleViewPurchaseHistory(user.id, user.name)}>הצג היסטוריית רכישות</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* מודל לעריכת משתמש */}
      {isEditModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeEditModal}>&times;</span>
            <h2>עריכת משתמש - {selectedUser?.name}</h2>

            <div className="form-group">
              <p>האם היוזר אדמין?</p>
              <label>
                <input
                  type="radio"
                  name="isAdmin"
                  checked={isAdmin === true}
                  onChange={() => setIsAdmin(true)}
                />
                כן
              </label>
              <label>
                <input
                  type="radio"
                  name="isAdmin"
                  checked={isAdmin === false}
                  onChange={() => setIsAdmin(false)}
                />
                לא
              </label>
            </div>

            <div className="form-group">
              <p>סוג משתמש:</p>
              <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                <option value="regular">רגיל</option>
                <option value="agent">סוכן</option>
              </select>
            </div>

            <button onClick={handleSaveChanges}>שמור שינויים</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
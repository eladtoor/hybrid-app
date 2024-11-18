import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { deleteField } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/actions/productActions';
import '../styles/UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userType, setUserType] = useState('regular');
  const [productDiscounts, setProductDiscounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // משיכת מוצרים מ-Redux
  const products = useSelector((state) => state.products.products);

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
    dispatch(fetchProducts()); // משיכת מוצרים מ-Redux
  }, [dispatch]);

  useEffect(() => {
    const filtered = products
      .filter(product =>
        product['שם'].toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.מזהה.toString().includes(searchQuery)
      )
      .slice(0, 3); // מגביל ל-3 תוצאות בלבד
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsAdmin(user.isAdmin);
    setUserType(user.userType || 'regular');
    setProductDiscounts(user.productDiscounts || []);
    setIsEditModalOpen(true);
  };

  const handleViewPurchaseHistory = (userId, userName) => {
    navigate(`/purchase-history/${userId}/${userName}`);
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
        const updateData = {
          isAdmin,
          userType,
          cartDiscount: selectedUser.cartDiscount || 0,
        };

        if (userType === 'agent') {
          updateData.productDiscounts = productDiscounts; // שמירת ההנחות למוצרים ספציפיים בפיירבייס
        } else {
          updateData.cartDiscount = deleteField();
          updateData.productDiscounts = deleteField();
        }

        // עדכון בפיירבייס
        await updateDoc(userRef, updateData);

        // עדכון המצב המקומי
        setUsers(users.map(user =>
          user.id === selectedUser.id
            ? {
              ...user,
              isAdmin,
              userType,
              cartDiscount: userType === 'regular' ? undefined : selectedUser.cartDiscount || 0,
              productDiscounts: userType === 'regular' ? undefined : productDiscounts,
            }
            : user
        ));
        closeEditModal();
      } catch (error) {
        console.error('Error updating user:', error);
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
            <th>הנחת סוכן כללית</th>
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
              <td>
                {user.userType === 'agent'
                  ? `${user.cartDiscount || 0}%`
                  : 'לא זמין'}
              </td>
              <td className="action-buttons">
                <button onClick={() => handleEditUser(user)}>עריכה</button>
                <button onClick={() => handleViewPurchaseHistory(user.id, user.name)}>
                  הצג היסטוריית רכישות
                </button>
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
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={isAdmin}
                  onChange={() => setIsAdmin(!isAdmin)}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="form-group">
              <p>סוג משתמש:</p>
              <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                <option value="regular">רגיל</option>
                <option value="agent">סוכן</option>
              </select>
            </div>

            {/* שדה להנחה כללית לעגלה */}
            {userType === 'agent' && (
              <>
                <div className="form-group">
                  <p>הנחה כללית לעגלה (%):</p>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={selectedUser.cartDiscount || 0}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, cartDiscount: e.target.value })
                    }
                  />
                </div>

                {/* הנחות למוצרים ספציפיים */}
                {/* הנחות למוצרים ספציפיים */}
                <h3>הנחות למוצרים ספציפיים</h3>
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
                      {filteredProducts.slice(0, 3).map((product) => ( // מגביל ל-3 תוצאות בלבד
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
              </>
            )}

            <button onClick={handleSaveChanges}>שמור שינויים</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
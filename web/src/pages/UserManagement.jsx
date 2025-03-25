import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { deleteField } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/actions/productActions';
import { getWhatsAppDetails, saveWhatsAppDetails } from '../utils/WhatsappService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userType, setUserType] = useState('רגיל');
  const [productDiscounts, setProductDiscounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [referralCounts, setReferralCounts] = useState({});
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [whatsappMessage, setWhatsappMessage] = useState('');
  const [isCreditLine, setIsCreditLine] = useState(false); // הוסף ל-state

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux products
  const products = useSelector((state) => state.products.products);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const userDocs = await getDocs(usersCollection);
        const usersData = userDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        usersData.forEach(async (user) => {
          if (user.isCreditLine === undefined) {
            const userRef = doc(db, 'users', user.id);
            await updateDoc(userRef, { isCreditLine: false }); // ברירת מחדל: false
          }
        });
        setUsers(usersData);

        // Count referrals for each agent
        const counts = {};
        usersData.forEach(user => {
          if (user.referredBy) {
            const agentId = user.referredBy.trim(); // Ensure exact match
            counts[agentId] = (counts[agentId] || 0) + 1;
          }
        });

        setReferralCounts(counts);
        console.log('Referral Counts:', counts); // Debugging log

        // Save referral counts to the agent documents
        for (const agentId of Object.keys(counts)) {
          const referralCount = counts[agentId];
          console.log(`Updating agent ${agentId} with referral count: ${referralCount}`); // Debug log
          try {
            const agentRef = doc(db, 'users', agentId);
            await updateDoc(agentRef, { referralCount });
          } catch (error) {
            console.error(`Error updating agent ${agentId}:`, error);
          }
        }

        console.log('Referral counts updated successfully!');
      } catch (error) {
        console.error("Error fetching users or updating referral counts:", error);
      }
    };


    fetchUsers();

    const fetchWhatsAppDetails = async () => {
      try {
        const data = await getWhatsAppDetails('whatsapp-settings'); // מפתח לדוגמה
        if (data) {
          setWhatsappNumber(data.whatsappNumber || '');
          setWhatsappMessage(data.whatsappMessage || '');
        }
      } catch (error) {
        console.error('Error fetching WhatsApp details:', error);
      }
    };

    fetchWhatsAppDetails();


    dispatch(fetchProducts());
  }, [dispatch]);

  const handleSaveWhatsAppDetails = async () => {
    try {
      await saveWhatsAppDetails('whatsapp-settings', whatsappNumber, whatsappMessage); // מפתח לדוגמה
      alert('פרטי וואטסאפ נשמרו בהצלחה!');
    } catch (error) {
      console.error('Error saving WhatsApp details:', error);
    }
  };






  useEffect(() => {
    const filtered = products
      .filter(product =>
        product['שם'].toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.מזהה.toString().includes(searchQuery)
      )
      .slice(0, 3); // Limit to 3 results
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const handleEditUser = (user) => {
    console.log(user, "הדפסה");

    setSelectedUser(user);
    setIsAdmin(user.isAdmin);
    setUserType(user.userType || 'רגיל'); // Set to the correct user type
    setProductDiscounts(user.productDiscounts || []); // Default to an empty array if not set
    setIsCreditLine(user.isCreditLine || false); // הגדרת isCreditLine כברירת מחדל
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
      console.log(product, "פהפהפהה");

      setProductDiscounts((prevDiscounts) => [
        ...prevDiscounts,
        { productId: product._id, מזהה: product["מזהה"], productName: product['שם'], discount: 0 }
      ]);
    }
    setSearchQuery(''); // Clear the search query to close search results
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
        let referralLink = selectedUser.referralLink;
        if (userType === 'סוכן' && !referralLink) {
          // Generate referral link if it doesn't exist
          referralLink = `https://yourapp.com/register?ref=agent-${selectedUser.id}-${Date.now()}`;
        }

        const updateData = {
          isAdmin: isAdmin ?? false, // לוודא שהוא לא undefined
          userType: userType || 'רגיל', // לוודא שהוא לא undefined
          isCreditLine: isCreditLine ?? false, // לוודא שהוא לא undefined
          cartDiscount: userType === 'סוכן' ? (selectedUser.cartDiscount || 0) : deleteField(),
          productDiscounts: userType === 'רגיל' ? productDiscounts : deleteField(),
          referralLink: userType === 'סוכן' ? referralLink : deleteField(),
        };

        await updateDoc(userRef, updateData);

        setUsers(users.map(user =>
          user.id === selectedUser.id
            ? {
              ...user,
              isAdmin,
              userType: userType || 'רגיל',
              isCreditLine,
              cartDiscount: userType === 'סוכן' ? selectedUser.cartDiscount : undefined,
              productDiscounts: userType === 'רגיל' ? productDiscounts : undefined,
              referralLink: userType === 'סוכן' ? referralLink : undefined,
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
    <div className="user-management p-40">
      <h1 className='text-3xl font-bold text-gray-900 text-right mb-6 pr-4 border-r-4 border-primary'>ניהול משתמשים</h1>
      <table className="user-table">
        <thead>
          <tr>
            <th>שם משתמש</th>
            <th>אימייל</th>
            <th>טלפון</th>
            <th>כתובת</th>
            <th>סוג משתמש</th>
            <th>קו אשראי</th>

            <th>הנחת סוכן כללית</th>
            <th>פעולות</th>
            <th>לקוחות דרכו</th>
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
              <td>{user.userType === 'סוכן' || user.userType === 'agent' ? 'סוכן' : 'רגיל'}</td>
              <td>{user.isCreditLine ? 'כן' : 'לא'}</td> {/* הצגת קו אשראי */}
              <td>
                {user.userType === 'סוכן'
                  ? `${user.cartDiscount || 0}%`
                  : 'לא זמין'}
              </td>
              <td className="action-buttons">
                <button className="btn-outline m-2 text-grayish" onClick={() => handleEditUser(user)}>עריכה</button>
                <button className="btn-primary m-2" onClick={() => handleViewPurchaseHistory(user.id, user.name)}>
                  הצג היסטוריית רכישות
                </button>
              </td>
              <td>
                {user.userType === 'סוכן'
                  ? referralCounts[user.id] || 0
                  : 'לא זמין'}
              </td>

            </tr>
          ))}
        </tbody>
      </table>

      <div className="whatsapp-settings">
        <h2 className='text-3xl font-bold text-gray-900 text-right mb-6 pr-4 border-r-4 border-primary'>עריכת פרטי וואטסאפ</h2>
        <div className="form-group">
          <label>מספר וואטסאפ:</label>
          <input
            type="text"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>הודעת וואטסאפ:</label>
          <textarea
            value={whatsappMessage}
            onChange={(e) => setWhatsappMessage(e.target.value)}
          />
        </div>
        <button className='bg-primary hover:bg-orange-600 text-black font-bold py-2 px-6 rounded-lg shadow-md transition duration-300' onClick={handleSaveWhatsAppDetails}>שמור</button>
      </div>

      {isEditModalOpen && (
        <div className="modal">
          <div className="modal-content relative">
            <span className="absolute top-4 left-4 text-gray-500 hover:text-primary text-3xl cursor-pointer transition " onClick={closeEditModal}>&times;</span>
            <h2 className='text-xl font-bold text-gray-900 text-right mb-6 pr-4 border-r-4 border-primary'>עריכת משתמש - {selectedUser?.name}</h2>

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
              {console.log(userType)}

              <select
                value={userType === 'סוכן' || userType === 'agent' ? "סוכן" : "רגיל"} // Reflects the userType state
                onChange={(e) => setUserType(e.target.value)} // Updates the state on change
              >
                <option value="רגיל">רגיל</option>
                <option value="סוכן">סוכן</option>
              </select>
            </div>


            {(userType === 'סוכן' || userType === "agent") && (
              <div className="form-group">
                <p>הנחה כללית לעגלה (%):</p>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={selectedUser?.cartDiscount || 0}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, cartDiscount: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
            )}

            {userType === 'רגיל' && (
              <>
                <div className="form-group">
                  <p>האם המשתמש הוא "קו אשראי"?</p>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={isCreditLine}
                      onChange={() => setIsCreditLine(!isCreditLine)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

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
              </>
            )}

            <button className='btn-primary mt-4 text-light' onClick={handleSaveChanges}>שמור שינויים</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserManagement;

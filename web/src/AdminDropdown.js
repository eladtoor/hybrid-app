// components/AdminDropdown.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/AdminDropdown.css";

const AdminDropdown = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  return (
    <div
      className="admin-dropdown"
      onMouseEnter={() => setDropdownVisible(true)}
      onMouseLeave={() => setDropdownVisible(false)}
    >
      <i className="fa fa-cogs admin-icon"></i>
      {dropdownVisible && (
        <div className="dropdown-content">
          <Link to="/admin-panel">עריכת מוצרים</Link>
          <Link to="/user-management">ניהול משתמשים</Link>
        </div>
      )}
    </div>
  );
};

export default AdminDropdown;

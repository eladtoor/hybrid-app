import React from 'react';
import '../styles/Category.css';

const Category = ({ title, subcategories }) => {
    return (
        <div className="category">
            <hr className='hr'></hr>
            <h2 className="category-title">{title}</h2>
            <div className="subcategory-list">
                {subcategories.map((subcategory, index) => (
                    <div key={index} className="subcategory-card">
                        <img src={subcategory.image} alt={subcategory.name} className="subcategory-image" />
                        <p className="subcategory-name">{subcategory.name}</p>
                        <hr className='hr-card'></hr>


                    </div>

                ))}

            </div>

        </div>

    );
};

export default Category;
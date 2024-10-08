import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Category.css';



const Category = ({ title, subcategories }) => {
    const navigate = useNavigate();

    const moveToSubcategory = (subcategoryName) => {


        navigate(`/${title}/${subcategoryName}`);

    }

    const subcategoryArray = Object.values(subcategories)


    return (
        <div className="category">
            <hr className='hr'></hr>
            <h2 className="category-title">{title}</h2>
            <div className="subcategory-list">
                {subcategoryArray.length > 0 ? subcategoryArray.map((subcategory, index) => (
                    <button key={index} className="subcategory-card" onClick={() => moveToSubcategory(subcategory.categoryName)}>
                        {/* בדיקה אם יש מוצרים בתת קטגוריה */}
                        {/*console.log(subcategory.subCategories[0]?.products[0].image)*/}


                        <img
                            src={subcategory.subCategories[0]?.products[0].תמונות || subcategory.products[0].תמונות}
                            alt={subcategory.categoryName}
                            className="subcategory-image"
                        />

                        <hr className='hr-card'></hr>
                        <p className="subcategory-name">{subcategory.categoryName}</p>
                    </button>
                )) : ""}
            </div>
        </div>
    );
};

export default Category;

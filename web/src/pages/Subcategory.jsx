import React from 'react';
import { Navigate, useParams } from 'react-router-dom';


import { useSelector } from 'react-redux';
import "../styles/Category.css"

export const Subcategory = () => {
    const { subcategoryName } = useParams();

    // Get company categories from Redux store
    const companyCategories = useSelector((state) => state.categories.categories?.companyCategories);

    // Check if companyCategories is defined and not null
    if (!companyCategories) {
        return <p>קטגוריות לא זמינות.</p>;
    }
    console.log(companyCategories);
    // Convert the subcategories to an array (if it's an object)
    const subcategoriesArray = Object.values(companyCategories || {});

    const subCategories = subcategoriesArray.find(category => category.categoryName == subcategoryName).subCategories;

    console.log(subCategories);

    const moveToSubcategory = (subcategoryName) => {


        Navigate(`/${subcategoryName}/products`);

    }

    // If no matching subcategory or subcategories found
    if (subcategoriesArray.length === 0) {
        return <p>לא נמצאו תתי קטגוריות עבור {subcategoryName}.</p>;
    }

    return (<div className="category-section">
        <div className="sub-category">
            {/* Display the subcategories using the Category component */}

            <hr className='hr'></hr>
            <h2 className="category-title">{subcategoryName}</h2>
            <div className="subcategory-list">
                {subCategories.length > 0 ? subCategories.map((subcategory, index) => (
                    <button key={index} className="subcategory-card" onClick={() => moveToSubcategory(subcategory.SubCategoryName)}>
                        {/* בדיקה אם יש מוצרים בתת קטגוריה */}
                        {/*console.log(subcategory.subCategories[0]?.products[0].image)*/}


                        <img
                            src={subcategory.products[0].image || subcategory.products[0].image}
                            alt={subcategory.categoryName}
                            className="subcategory-image"
                        />

                        <hr className='hr-card'></hr>
                        <p className="subcategory-name">{subcategory.subCategoryName}</p>
                        {console.log(subcategory.subCategoryName)
                        }

                    </button>
                )) : ""}
            </div>

        </div>
    </div>
    );
};

export default Subcategory;
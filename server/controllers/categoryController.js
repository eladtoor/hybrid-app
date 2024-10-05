const Product = require("../models/productModel");

const buildCategoryStructure = async (req, res) => {
  try {
    const products = await Product.find();

    if (!products || products.length === 0) {
      return res.status(404).json({ error: "No products found" });
    }

    const categoryMap = {};

    products.forEach((product) => {
      const categories = product["קטגוריות"]; // וודא שהמפתח הוא בעברית כפי שמופיע ב-JSON
      if (!categories) {
        return;
      }

      const categoryPaths = categories.split(","); // מחלק לפי פסיקים לקטגוריות שונות

      categoryPaths.forEach((categoryPath) => {
        const categoryParts = categoryPath.split(">"); // מפצל לפי '>'
        const mainCategory = categoryParts[0].trim(); // קטגוריה ראשית
        const subCategories = categoryParts.slice(1).map((sub) => sub.trim()); // תתי קטגוריות

        // אם הקטגוריה הראשית לא קיימת, ניצור אותה במפה
        if (!categoryMap[mainCategory]) {
          categoryMap[mainCategory] = {
            categoryName: mainCategory,
            subCategories: [],
            products: [], // רשימה למוצרים בקטגוריה הראשית (ללא תתי קטגוריות)
          };
        }

        let currentCategory = categoryMap[mainCategory];

        // אם יש תתי קטגוריות, נוסיף מוצרים לתתי קטגוריות
        if (subCategories.length > 0) {
          subCategories.forEach((subCategory) => {
            let foundSubCategory = currentCategory.subCategories.find(
              (sc) => sc.subCategoryName === subCategory
            );
            if (!foundSubCategory) {
              foundSubCategory = { subCategoryName: subCategory, products: [] };
              currentCategory.subCategories.push(foundSubCategory);
            }

            // הוספת המוצר לתוך תת הקטגוריה עם כל השדות של המוצר
            foundSubCategory.products.push({
              ...product._doc, // שימוש בכל השדות הקיימים במוצר
            });
          });
        } else {
          // אם אין תתי קטגוריות, נוסיף את המוצרים ישירות לקטגוריה הראשית
          currentCategory.products.push({
            ...product._doc, // שימוש בכל השדות הקיימים במוצר
          });
        }
      });
    });

    // הפיכת המפה לאובייקט היררכי
    const result = Object.values(categoryMap);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in buildCategoryStructure:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  buildCategoryStructure,
};

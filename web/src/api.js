// פונקציה לקבלת כל המוצרים
export const fetchAllProducts = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/getAll`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// פונקציה לקבלת מוצר לפי מזהה
export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

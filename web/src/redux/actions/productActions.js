// actions/productActions.js
const getBaseUrl = () => {
  return process.env.REACT_APP_BASE_URL || "http://localhost:5000";
};
// Fetch products from the server
export const fetchProducts = () => async (dispatch) => {
  dispatch({ type: "FETCH_PRODUCTS_REQUEST" });
  try {
    const response = await fetch(`${getBaseUrl()}/api/products/getAll`);
    const data = await response.json();

    // Save products to localStorage
    localStorage.setItem("products", JSON.stringify(data));

    dispatch({ type: "FETCH_PRODUCTS_SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "FETCH_PRODUCTS_FAILURE", payload: error.message });
  }
};

// Create a new product
export const createProduct = (newProductData) => async (dispatch) => {
  dispatch({ type: "CREATE_PRODUCT_REQUEST" });
  try {
    console.log(newProductData);

    const response = await fetch(`${getBaseUrl()}/api/products/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProductData),
    });

    const data = await response.json();

    if (response.ok) {
      // Dispatch success action if product created successfully
      dispatch({ type: "CREATE_PRODUCT_SUCCESS", payload: data });

      // Fetch updated products after creating a new one
      dispatch(fetchProducts());

      // Fetch the updated categories
      const categoriesResponse = await fetch(`${getBaseUrl()}/api/categories`);
      const categoriesData = await categoriesResponse.json();
      console.log("Updated Categories:", categoriesData);

      // Create the updated category structure
      const updatedCategories = {
        companyName: "טמבור",
        companyCategories: { ...categoriesData },
      };

      // Save updated categories to localStorage
      localStorage.setItem("categories", JSON.stringify(updatedCategories));

      // Dispatch the updated categories to Redux store
      dispatch({ type: "SET_CATEGORIES", payload: updatedCategories });

      console.log("Categories updated successfully in localStorage and Redux.");
    } else {
      // Handle failure in response
      dispatch({
        type: "CREATE_PRODUCT_FAILURE",
        payload: data.message || "Failed to create product",
      });
    }
  } catch (error) {
    // Dispatch failure action if there was a network or server error
    dispatch({ type: "CREATE_PRODUCT_FAILURE", payload: error.message });
  }
};

// Delete a product
export const deleteProduct = (productId) => async (dispatch) => {
  dispatch({ type: "DELETE_PRODUCT_REQUEST" });
  try {
    const response = await fetch(
      `${getBaseUrl()}/api/products/delete/${productId}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      // Dispatch success action after successful deletion
      dispatch({ type: "DELETE_PRODUCT_SUCCESS", payload: productId });

      // Optionally, refetch products after deletion
      dispatch(fetchProducts());
    } else {
      const data = await response.json();
      dispatch({
        type: "DELETE_PRODUCT_FAILURE",
        payload: data.message || "Failed to delete product",
      });
    }
  } catch (error) {
    dispatch({ type: "DELETE_PRODUCT_FAILURE", payload: error.message });
  }
};

// actions/productActions.js

// פעולה לעדכון מוצר קיים
export const updateProduct = (updatedProduct) => async (dispatch) => {
  dispatch({ type: "UPDATE_PRODUCT_REQUEST" });
  try {
    const response = await fetch(
      `${getBaseUrl()}/api/products/update/${updatedProduct._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      }
    );

    const data = await response.json();

    if (response.ok) {
      // Dispatch success action after updating the product
      dispatch({ type: "UPDATE_PRODUCT_SUCCESS", payload: data });

      // Fetch the updated list of products
      dispatch(fetchProducts());

      // Fetch the updated categories
      const categoriesResponse = await fetch(`${getBaseUrl()}/api/categories`);
      const categoriesData = await categoriesResponse.json();
      console.log("Updated Categories:", categoriesData);

      // Create the updated category structure
      const updatedCategories = {
        companyName: "טמבור",
        companyCategories: { ...categoriesData },
      };

      // Save updated categories to localStorage
      localStorage.setItem("categories", JSON.stringify(updatedCategories));

      // Dispatch the updated categories to Redux store
      dispatch({ type: "SET_CATEGORIES", payload: updatedCategories });

      console.log("Categories updated successfully in localStorage and Redux.");
    } else {
      dispatch({
        type: "UPDATE_PRODUCT_FAILURE",
        payload: data.message || "Failed to update product",
      });
    }
  } catch (error) {
    dispatch({ type: "UPDATE_PRODUCT_FAILURE", payload: error.message });
  }
};

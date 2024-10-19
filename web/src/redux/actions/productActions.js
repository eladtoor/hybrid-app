// actions/productActions.js

// Fetch products from the server
export const fetchProducts = () => async (dispatch) => {
  dispatch({ type: "FETCH_PRODUCTS_REQUEST" });
  try {
    const response = await fetch("http://localhost:5000/api/products/getAll");
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
    // POST request to create a new product
    const response = await fetch("http://localhost:5000/api/products/create", {
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

      // Optionally, refetch products after creating a new one
      dispatch(fetchProducts());
    } else {
      // Handle failure in response
      dispatch({ type: "CREATE_PRODUCT_FAILURE", payload: data.message || "Failed to create product" });
    }
  } catch (error) {
    // Dispatch failure action if there was a network or server error
    dispatch({ type: "CREATE_PRODUCT_FAILURE", payload: error.message });
  }
};
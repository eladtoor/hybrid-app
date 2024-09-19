export const fetchProducts = () => async (dispatch) => {
  dispatch({ type: "FETCH_PRODUCTS_REQUEST" });
  try {
    const response = await fetch("http://localhost:5000/api/products/getAll");
    const data = await response.json();
    console.log(data);

    dispatch({ type: "FETCH_PRODUCTS_SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "FETCH_PRODUCTS_FAILURE", payload: error.message });
  }
};

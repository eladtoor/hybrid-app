export const fetchCategories = () => async (dispatch) => {
  dispatch({ type: "FETCH_CATEGORIES_REQUEST" });
  try {
    const response = await fetch("http://localhost:5000/api/categories");
    const data = await response.json();
    const newData = { companyName: "טמבור", companyCategories: { ...data } };
    dispatch({ type: "FETCH_CATEGORIES_SUCCESS", payload: newData });
  } catch (error) {
    dispatch({ type: "FETCH_CATEGORIES_FAILURE", payload: error.message });
    console.log("catch here");
  }
};
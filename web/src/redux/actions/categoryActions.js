export const fetchCategories = () => async (dispatch) => {
  dispatch({ type: "FETCH_CATEGORIES_REQUEST" });

  try {
    const getBaseUrl = () => {
      return process.env.REACT_APP_BASE_URL || "http://localhost:5000"; // ✅ Correct Port
    };

    const response = await fetch(`${getBaseUrl()}/api/category`); // ✅ Ensure correct API path
    const data = await response.json();

    console.log("📦 Received Categories:", data);

    const newData = { companyName: "טמבור", companyCategories: { ...data } };

    // ✅ Save categories to localStorage
    localStorage.setItem("categories", JSON.stringify(newData));

    dispatch({ type: "FETCH_CATEGORIES_SUCCESS", payload: newData });
  } catch (error) {
    console.error("❌ Error Fetching Categories:", error);
    dispatch({ type: "FETCH_CATEGORIES_FAILURE", payload: error.message });
  }
};

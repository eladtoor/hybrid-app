export const fetchCategories = () => async (dispatch) => {
  dispatch({ type: "FETCH_CATEGORIES_REQUEST" });

  try {
    const getBaseUrl = () => {
      return process.env.REACT_APP_BASE_URL || "http://localhost:5000";
    };

    const response = await fetch(`${getBaseUrl()}/api/category`);
    const data = await response.json();

    if (!data || Object.keys(data).length === 0) {
      console.warn("⚠️ Empty categories received, ignoring update.");
      return;
    }

    console.log("📦 Received Categories:", data);

    const newData = { companyName: "טמבור", companyCategories: { ...data } };

    localStorage.setItem("categories", JSON.stringify(newData));

    dispatch({ type: "FETCH_CATEGORIES_SUCCESS", payload: newData });
  } catch (error) {
    console.error("❌ Error Fetching Categories:", error);
    dispatch({ type: "FETCH_CATEGORIES_FAILURE", payload: error.message });
  }
};

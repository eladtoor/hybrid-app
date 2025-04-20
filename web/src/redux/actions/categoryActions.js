export const fetchCategories = () => async (dispatch) => {
  localStorage.setItem("categoriesLastFetched", Date.now());

  dispatch({ type: "FETCH_CATEGORIES_REQUEST" });

  try {
    const getBaseUrl = () => {
      return process.env.REACT_APP_BASE_URL || "http://localhost:5000";
    };

    const response = await fetch(`${getBaseUrl()}/api/categories`); // ✅ Use correct API path
    let data;
    try {
      data = await response.json();
    } catch (error) {
      console.error(
        "❌ Server returned non-JSON response",
        await response.text()
      );
      return;
    }

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

export const maybeFetchCategories = () => async (dispatch) => {
  const cached = localStorage.getItem("categories");
  const lastFetched = localStorage.getItem("categoriesLastFetched");

  const isExpired =
    !lastFetched || Date.now() - Number(lastFetched) > 30 * 60 * 1000;

  if (cached) {
    dispatch({
      type: "SET_CATEGORIES_FROM_STORAGE",
      payload: JSON.parse(cached),
    });
  }

  if (!cached || isExpired) {
    console.log("Update happening");

    dispatch(fetchCategories());
  }
};

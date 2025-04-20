import { socket } from "../store"; // ✅ Import the global WebSocket from store.js

// ✅ Ensure WebSocket connection is properly initialized
const getWsBaseUrl = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:5000";
  return baseUrl.startsWith("https")
    ? baseUrl.replace("https", "wss")
    : baseUrl.replace("http", "ws");
};

// ✅ WebSocket Listener for Product Updates
export const listenForProductUpdates = () => (dispatch) => {
  if (!window.socket) {
    const wsBaseUrl = getWsBaseUrl();
    window.socket = new WebSocket(wsBaseUrl);
  }

  window.socket.onopen = () => {
    console.log("🟢 WebSocket Connected");
  };

  window.socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      console.log("🔄 WebSocket - Raw message from server:", message);

      if (message.type === "PRODUCTS_UPDATED") {
        console.log(
          "🔄 WebSocket - Received updated products:",
          message.payload
        );
        dispatch(updateProductsList(message.payload));
      } else if (message.type === "CATEGORIES_UPDATED") {
        console.log("🔄 Received Categories Update:", message.payload);
        dispatch(fetchCategories());
      }
    } catch (error) {
      console.error("❌ Error parsing WebSocket message:", error);
    }
  };

  window.socket.onclose = () => {
    console.log("🔴 WebSocket Disconnected");
  };
};

// ✅ Get API Base URL
const getBaseUrl = () =>
  process.env.REACT_APP_BASE_URL || "http://localhost:5000";

// ✅ Fetch Products from Server
export const fetchProducts = () => async (dispatch) => {
  dispatch({ type: "FETCH_PRODUCTS_REQUEST" });

  try {
    const response = await fetch(`${getBaseUrl()}/api/products/getAll`);
    const data = await response.json();

    dispatch({ type: "FETCH_PRODUCTS_SUCCESS", payload: data });

    localStorage.setItem("products", JSON.stringify(data)); // שמירה ל-localStorage
    localStorage.setItem("productsLastFetched", Date.now());
  } catch (error) {
    console.error("❌ FetchProducts Failed:", error);
    dispatch({ type: "FETCH_PRODUCTS_FAILURE", payload: error.message });
  }
};

export const maybeFetchProducts = () => async (dispatch) => {
  const cached = localStorage.getItem("products");
  const lastFetched = localStorage.getItem("productsLastFetched");

  const isExpired =
    !lastFetched || Date.now() - Number(lastFetched) > 1 * 60 * 1000; // 1 דקות

  if (cached) {
    dispatch({
      type: "SET_PRODUCTS_FROM_STORAGE",
      payload: JSON.parse(cached),
    });
  }

  if (!cached || isExpired) {
    dispatch(fetchProducts()); // יביא מהשרת
  }
};

// ✅ Create a New Product
export const createProduct = (newProductData) => async (dispatch) => {
  dispatch({ type: "CREATE_PRODUCT_REQUEST" });

  try {
    console.log("📤 Sending new product data:", newProductData);

    const response = await fetch(`${getBaseUrl()}/api/products/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProductData),
    });

    const data = await response.json();

    if (response.ok) {
      dispatch({ type: "CREATE_PRODUCT_SUCCESS", payload: data });

      // ✅ Notify WebSocket to update all users
      if (window.socket && window.socket.readyState === WebSocket.OPEN) {
        window.socket.send(JSON.stringify({ type: "REQUEST_PRODUCTS_UPDATE" }));
        window.socket.send(
          JSON.stringify({ type: "REQUEST_CATEGORIES_UPDATE" })
        );
      }

      // ✅ Fetch Updated Categories
      dispatch(fetchCategories());
    } else {
      dispatch({
        type: "CREATE_PRODUCT_FAILURE",
        payload: data.message || "Failed to create product",
      });
    }
  } catch (error) {
    dispatch({ type: "CREATE_PRODUCT_FAILURE", payload: error.message });
  }
};

// ✅ Delete a Product
export const deleteProduct = (productId) => async (dispatch) => {
  dispatch({ type: "DELETE_PRODUCT_REQUEST" });

  try {
    const response = await fetch(
      `${getBaseUrl()}/api/products/delete/${productId}`,
      { method: "DELETE" }
    );

    if (response.ok) {
      dispatch({ type: "DELETE_PRODUCT_SUCCESS", payload: productId });

      // ✅ Notify WebSocket to update all users
      if (window.socket && window.socket.readyState === WebSocket.OPEN) {
        window.socket.send(JSON.stringify({ type: "REQUEST_PRODUCTS_UPDATE" }));
        window.socket.send(
          JSON.stringify({ type: "REQUEST_CATEGORIES_UPDATE" })
        );
      }
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

// ✅ Update a Product
export const updateProduct = (updatedProduct) => async (dispatch) => {
  dispatch({ type: "UPDATE_PRODUCT_REQUEST" });

  try {
    const response = await fetch(
      `${getBaseUrl()}/api/products/update/${updatedProduct._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      }
    );

    const data = await response.json();

    if (response.ok) {
      dispatch({ type: "UPDATE_PRODUCT_SUCCESS", payload: data });

      console.log("⏳ Fetching fresh products from server after update...");
      setTimeout(() => {
        dispatch(fetchProducts());
      }, 500);

      // ✅ Notify WebSocket to update all users
      if (window.socket && window.socket.readyState === WebSocket.OPEN) {
        window.socket.send(JSON.stringify({ type: "REQUEST_PRODUCTS_UPDATE" }));
        window.socket.send(
          JSON.stringify({ type: "REQUEST_CATEGORIES_UPDATE" })
        );
      }

      // ✅ Fetch Updated Categories
      dispatch(fetchCategories());
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

// ✅ Fetch Updated Categories (Helper Function)
export const fetchCategories = () => async (dispatch) => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/categories`);
    const categoriesData = await response.json();

    console.log("🔄 Updated Categories:", categoriesData);

    const updatedCategories = {
      companyName: "טמבור",
      companyCategories: { ...categoriesData },
    };

    localStorage.setItem("categories", JSON.stringify(updatedCategories));

    dispatch({ type: "SET_CATEGORIES", payload: updatedCategories });
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
  }
};

// ✅ Update Redux with Updated Products
export const updateProductsList = (updatedProducts) => ({
  type: "UPDATE_PRODUCTS_LIST",
  payload: updatedProducts,
});

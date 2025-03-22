// reducers/productReducer.js

const initialState = {
  products: [],
  loading: false,
  error: null,
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_PRODUCTS_REQUEST":
      return { ...state, loading: true };

    case "FETCH_PRODUCTS_SUCCESS":
      console.log(
        "🔄 Redux - Fetched new products from server:",
        action.payload
      );

      localStorage.setItem("products", JSON.stringify(action.payload)); // ✅ Save fetched products

      return { ...state, loading: false, products: action.payload };

    case "FETCH_PRODUCTS_FAILURE":
      return { ...state, loading: false, error: action.payload };

    case "CREATE_PRODUCT_REQUEST":
      return { ...state, loading: true };

    case "CREATE_PRODUCT_SUCCESS":
      const newProductList = [...state.products, action.payload];

      localStorage.setItem("products", JSON.stringify(newProductList)); // ✅ Save after creating
      return { ...state, loading: false, products: newProductList };

    case "CREATE_PRODUCT_FAILURE":
      return { ...state, loading: false, error: action.payload };

    case "SET_PRODUCTS_FROM_STORAGE":
      return { ...state, products: action.payload };

    case "DELETE_PRODUCT_REQUEST":
      return { ...state, loading: true };

    case "DELETE_PRODUCT_SUCCESS":
      const updatedProductList = state.products.filter(
        (product) => product._id !== action.payload
      );
      localStorage.setItem("products", JSON.stringify(updatedProductList)); // ✅ Save after deleting
      return { ...state, loading: false, products: updatedProductList };

    case "DELETE_PRODUCT_FAILURE":
      return { ...state, loading: false, error: action.payload };

    case "UPDATE_PRODUCT_REQUEST":
      return { ...state, loading: true };

    case "UPDATE_PRODUCT_SUCCESS":
      console.log("✅ Redux - Updated product in state:", action.payload);

      const modifiedProducts = state.products.map((product) =>
        product._id === action.payload._id ? action.payload : product
      );

      localStorage.setItem("products", JSON.stringify(modifiedProducts)); // ✅ Save after updating

      return { ...state, loading: false, products: modifiedProducts };

    case "UPDATE_PRODUCTS_LIST":
      console.log("🔄 WebSocket - Received updated products:", action.payload);
      console.log(action.payload);

      // 🔍 סינון מוצרים עם ערכים לא תקינים (0 במחיר, תיאור ריק וכו')
      const filteredProducts = action.payload.map((product) => {
        if (!product.מחיר || product.מחיר === 0) {
          return state.products.find((p) => p._id === product._id) || product; // מחזיר את המוצר הקיים אם נמצא
        }
        return product;
      });

      localStorage.setItem("products", JSON.stringify(filteredProducts)); // ✅ שמירת מוצרים תקינים בלבד
      return {
        ...state,
        products: filteredProducts,
      };

    case "UPDATE_PRODUCT_FAILURE":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default productReducer;

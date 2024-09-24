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
      return { ...state, loading: false, products: action.payload };
    case "FETCH_PRODUCTS_FAILURE":
      return { ...state, loading: false, error: action.payload };

    // New case to set products from localStorage
    case "SET_PRODUCTS_FROM_STORAGE":
      return { ...state, products: action.payload };

    default:
      return state;
  }
};

export default productReducer;

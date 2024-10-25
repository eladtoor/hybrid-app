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
      return { ...state, loading: false, products: action.payload };

    case "FETCH_PRODUCTS_FAILURE":
      return { ...state, loading: false, error: action.payload };

    case "CREATE_PRODUCT_REQUEST":
      return { ...state, loading: true };

    case "CREATE_PRODUCT_SUCCESS":
      return {
        ...state,
        loading: false,
        products: [...state.products, action.payload],
      };

    case "CREATE_PRODUCT_FAILURE":
      return { ...state, loading: false, error: action.payload };

    case "SET_PRODUCTS_FROM_STORAGE":
      return { ...state, products: action.payload };

    case "DELETE_PRODUCT_REQUEST":
      return { ...state, loading: true };

    case "DELETE_PRODUCT_SUCCESS":
      return {
        ...state,
        loading: false,
        products: state.products.filter(
          (product) => product._id !== action.payload
        ),
      };

    case "DELETE_PRODUCT_FAILURE":
      return { ...state, loading: false, error: action.payload };

    case "UPDATE_PRODUCT_REQUEST":
      return { ...state, loading: true };

    case "UPDATE_PRODUCT_SUCCESS":
      return {
        ...state,
        loading: false,
        products: state.products.map((product) =>
          product._id === action.payload._id ? action.payload : product
        ),
      };

    case "UPDATE_PRODUCT_FAILURE":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default productReducer;

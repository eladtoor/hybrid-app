import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "../redux/reducers/index";
import { thunk } from "redux-thunk";

// ✅ Ensure WebSocket is only initialized ONCE
if (!window.socket) {
  const getWsBaseUrl = () => {
    const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:5000";
    return baseUrl.startsWith("https")
      ? baseUrl.replace("https", "wss")
      : baseUrl.replace("http", "ws");
  };

  window.socket = new WebSocket(getWsBaseUrl());

  window.socket.onopen = () => {
    console.log("🟢 WebSocket Connected (Global)");
  };

  window.socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      if (message.type === "PRODUCTS_UPDATED") {
        console.log("🔄 Received WebSocket Update:", message.payload);
        store.dispatch({
          type: "UPDATE_PRODUCTS_LIST",
          payload: message.payload,
        });
        localStorage.setItem("products", JSON.stringify(message.payload));
      } else if (message.type === "CATEGORIES_UPDATED") {
        console.log("🔄 Received Categories Update:", message.payload);
        store.dispatch({ type: "SET_CATEGORIES", payload: message.payload });
        localStorage.setItem("categories", JSON.stringify(message.payload));
      }
    } catch (error) {
      console.error("❌ WebSocket Message Error:", error);
    }
  };

  window.socket.onclose = () => {
    console.log("🔴 WebSocket Disconnected");
  };
}

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(thunk),
});

export const persistor = persistStore(store);
export default store;

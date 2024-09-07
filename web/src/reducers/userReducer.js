import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    logoutSuccess: false // משתנה למעקב אחרי התנתקות
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.logoutSuccess = false; // איפוס הודעת ההתנתקות
    },
    logoutUser: (state) => {
      state.user = null;
      state.logoutSuccess = true; // סימון ההתנתקות כהצלחה
    },
    clearLogoutMessage: (state) => {
      state.logoutSuccess = false; // איפוס הודעת ההתנתקות
    }
  },
});

export const { setUser, logoutUser, clearLogoutMessage } = userSlice.actions;
export default userSlice.reducer;

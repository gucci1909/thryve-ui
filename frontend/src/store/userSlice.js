import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token") || null,
  _id: JSON.parse(localStorage.getItem("_id")) || null,
  email: JSON.parse(localStorage.getItem("email")) || null,
  badgeType: JSON.parse(localStorage.getItem("badgeType")) || null,
  username: JSON.parse(localStorage.getItem("username")) || null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state._id = action.payload._id;
      state.email = action.payload.email;
      state.badgeType = action.payload.badgeType;
      state.username = action.payload.username;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("_id", JSON.stringify(action.payload._id));
      localStorage.setItem("email", JSON.stringify(action.payload.email));
      localStorage.setItem("badgeType", JSON.stringify(action.payload.badgeType));
      localStorage.setItem("username", JSON.stringify(action.payload.username));
    },
    logout: (state) => {
      state.token = null;
      state._id = null;
      state.badgeType = null;
      state.email = null;
      state.username = null;

      localStorage.removeItem("token");
      localStorage.removeItem("_id");
      localStorage.removeItem("email");
      localStorage.removeItem("badgeType");
      localStorage.removeItem("username");
    },
    updateProfile: (state, action) => {
      state.profile = action.payload;
    },
  },
});

export const { login, logout, updateProfile } = userSlice.actions;
export default userSlice.reducer;

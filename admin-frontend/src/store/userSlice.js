import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token") || null,
  _id: JSON.parse(localStorage.getItem("_id")) || null,
  email: JSON.parse(localStorage.getItem("email")) || null,
  firstName: JSON.parse(localStorage.getItem("firstName")) || null,
  role: JSON.parse(localStorage.getItem("role")) || null,
  companyId: JSON.parse(localStorage.getItem("companyId")) || null,
};

const userSlice = createSlice({
  name: "adminUser",
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state._id = action.payload._id;
      state.email = action.payload.email;
      state.firstName = action.payload.firstName;
      state.role = action.payload.role;
      state.companyId = action.payload.companyId;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("_id", JSON.stringify(action.payload._id));
      localStorage.setItem("email", JSON.stringify(action.payload.email));
      localStorage.setItem(
        "firstName",
        JSON.stringify(action.payload.firstName),
      );
      localStorage.setItem("role", JSON.stringify(action.payload.role));
      localStorage.setItem(
        "companyId",
        JSON.stringify(action.payload.companyId),
      );
    },
    logout: (state) => {
      state.token = null;
      state._id = null;
      state.email = null;
      state.firstName = null;
      state.role = null;
      state.companyId = null;

      localStorage.removeItem("token");
      localStorage.removeItem("_id");
      localStorage.removeItem("email");
      localStorage.removeItem("firstName");
      localStorage.removeItem("role");
      localStorage.removeItem("companyId");
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;

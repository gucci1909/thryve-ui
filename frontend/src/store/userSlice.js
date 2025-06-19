import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token") || null,
  _id: JSON.parse(localStorage.getItem("_id")) || null,
  email: JSON.parse(localStorage.getItem("email")) || null,
  firstName: JSON.parse(localStorage.getItem("firstName")) || null,
  reportData: JSON.parse(localStorage.getItem("reportData")) || null,
  personalize: JSON.parse(localStorage.getItem("personalize")) || null,
  companyCode: JSON.parse(localStorage.getItem("companyCode")) || null,
  points: parseInt(localStorage.getItem("points")) || 0,
  chatMode: "none",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state._id = action.payload._id;
      state.email = action.payload.email;
      state.firstName = action.payload.firstName;
      state.personalize = action.payload.personalized;
      state.points = action.payload.points || 0;
      state.chatMode = 'none';

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("_id", JSON.stringify(action.payload._id));
      localStorage.setItem("email", JSON.stringify(action.payload.email));
      localStorage.setItem(
        "firstName",
        JSON.stringify(action.payload.firstName),
      );
      localStorage.setItem("points", action.payload.points || 0);
      if (!action.payload.personalized) {
        localStorage.setItem("personalize", "false");
      } else {
        localStorage.setItem("personalize", "true");
      }
    },
    logout: (state) => {
      state.token = null;
      state._id = null;
      state.email = null;
      state.firstName = null;
      state.reportData = null;
      state.personalize = null;
      state.points = 0;

      localStorage.removeItem("token");
      localStorage.removeItem("_id");
      localStorage.removeItem("email");
      localStorage.removeItem("firstName");
      localStorage.removeItem("reportData");
      localStorage.removeItem("personalize");
      localStorage.removeItem("points");
    },
    updatePoints: (state, action) => {
      state.points = action.payload;
      localStorage.setItem("points", action.payload);
    },
    reportDatafunc: (state, action) => {
      state.reportData = action.payload;
      state.personalize = true;

      localStorage.setItem("reportData", JSON.stringify(action.payload));
      localStorage.setItem("personalize", "true");
    },
    updateCompanyCode: (state, action) => {
      state.companyCode = action.payload;
      localStorage.setItem("companyCode", JSON.stringify(action.payload));
    },
    updateProfile: (state, action) => {
      state.profile = action.payload;
    },
    setChatMode: (state, action) => {
      state.chatMode = action.payload;
    },
  },
});

export const { 
  login, 
  logout, 
  updateProfile, 
  reportDatafunc, 
  updateCompanyCode,
  updatePoints,
  setChatMode
} = userSlice.actions;
export default userSlice.reducer;

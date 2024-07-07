import { createSlice } from "@reduxjs/toolkit";

const registerFormSlice = createSlice({
  name: "registerForm",
  initialState: {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    country: "Vietnam",
    ward: "",
    district: "",
    coordinateX: 0,
    coordinateY: 0,
    phone: "",
    orgName: "",
    otpVerify: "",
  },
  reducers: {
    updateRegisterForm(state, action) {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateRegisterForm } = registerFormSlice.actions;
export const registerFormReducer = registerFormSlice.reducer;

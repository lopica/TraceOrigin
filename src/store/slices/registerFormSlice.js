import { createSlice } from "@reduxjs/toolkit";

const registerFormSlice = createSlice({
  name: "registerForm",
  initialState: {
    email: "",
    firstName: "",
    lastName: "",
    province: "",
    district: "",
    ward: "",
    address: "",
    phone: "",
    password: "",
  },
  reducers: {
    updateForm(state, action) {
        return { ...state, ...action.payload };
    },
  },
});

export const { updateForm } = registerFormSlice.actions;
export const registerFormReducer = registerFormSlice.reducer;

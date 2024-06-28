import { createSlice } from "@reduxjs/toolkit";

const registerFormSlice = createSlice({
  name: "registerForm",
  initialState: {
    email: "",
    firstName: "",
    lastName: "",
    province: {
      id: "",
      name: "",
    },
    district: {
      id: "",
      name: "",
    },
    ward: {
      id: "",
      name: "",
    },
    address: "",
    phone: "",
    password: "",
    cf_password: "",
  },
  reducers: {
    updateForm(state, action) {
        return { ...state, ...action.payload };
    },
  },
});

export const { updateForm } = registerFormSlice.actions;
export const registerFormReducer = registerFormSlice.reducer;

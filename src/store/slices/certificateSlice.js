import { createSlice } from "@reduxjs/toolkit";

const certificateSlice = createSlice({
  name: "certificateSlice",
  initialState: {
    nameSearch: "",
    categorySearch: "",
    list: [],
    certificateDetail: {}
  },
  reducers: {
    updateCertiList(state, action) {
      state.list = action.payload;
    },
    updateNameCertiSearch(state, action) {
      state.nameSearch = action.payload;
    },
    updateCertificateDetail(state, action) {
      state.certificateDetail = action.payload;
    }
  },
});

export const { updateNameCertiSearch, updateCertiList, updateCertificateDetail } =
  certificateSlice.actions;
export const certificateSliceReducer = certificateSlice.reducer;

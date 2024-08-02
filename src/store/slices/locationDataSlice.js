import { createSlice } from "@reduxjs/toolkit";

const locationDataSlice = createSlice({
  name: "locationDataSlice",
  initialState: {
    provincesData: [],
    districtsData: [
      { id: "initial", content: "Bạn cần chọn tỉnh, thành phố trước" },
    ],
    wardsData: [{ id: "initial", content: "Bạn cần chọn quận, huyện trước" }],
    currentLocationId: {
      provinceId: "",
      districtId: "",
    },
    coordinate: [],
    loadingNewAddress: false,
    verifyAddress: false,
  },
  reducers: {
    // Action to update the list of provinces
    updateProvinces(state, action) {
      state.provincesData = action.payload;
    },
    // Action to update the list of districts
    updateDistricts(state, action) {
      state.districtsData = action.payload;
    },
    // Action to update the list of wards
    updateWards(state, action) {
      state.wardsData = action.payload;
    },
    updateCurrentLocationId(state, action) {
      state.currentLocationId = action.payload;
    },
    updateCoordinate(state, action) {
      state.coordinate = [...action.payload];
    },
    updateNewAddress(state, action) {
      state.loadingNewAddress = action.payload;
    },
    updateVerifyAddress(state, action) {
      state.verifyAddress = action.payload;
    },
  },
});

export const {
  updateProvinces,
  updateDistricts,
  updateWards,
  updateCurrentLocationId,
  updateCoordinate,
  updateNewAddress,
  updateVerifyAddress,
} = locationDataSlice.actions;
export const locationDataReducer = locationDataSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const locationDataSlice = createSlice({
  name: "location",
  initialState: {
    provincesData: [],
    districtsData: [],
    wardsData: [],
    currentLocationId: {
      provinceId: "",
      districtId: "",
    },
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
  },
});

export const { updateProvinces, updateDistricts, updateWards, updateCurrentLocationId } = locationDataSlice.actions;
export const locationDataReducer = locationDataSlice.reducer;

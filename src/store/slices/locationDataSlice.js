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
    coordinate: [],
    loadingNewAddress: false,
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
      state.coordinate = [action.payload.lat, action.payload.lng]
    },
    updateNewAddress(state, action) {
      state.loadingNewAddress = action.payload
    }
  },
});

export const { updateProvinces, updateDistricts, updateWards, updateCurrentLocationId, updateCoordinate, updateNewAddress } = locationDataSlice.actions;
export const locationDataReducer = locationDataSlice.reducer;

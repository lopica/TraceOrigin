import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  file: [],
  avatar: "",
  images: [],
  imagesData: [],
  form: {},
};

const certiFormSlice = createSlice({
  name: "certiFormSlice",
  initialState: initialState, 
  reducers: {
    removeCertiImage(state, action) {
      state.images = state.images.filter((_, index) => index !== action.payload);
    },
    removeCertiImageData(state, action) {
      state.imagesData = state.imagesData.filter((_, index) => index !== action.payload);
    },
    updateCertiImages(state, action) {
      state.images = action.payload;
    },
    updateCertiImagesData(state, action) {
      state.imagesData = action.payload;
    },
    updateCertiAvatar(state, action) {
      state.avatar = action.payload;
    },
    updateCertiForm(state, action) {
      state.form = { ...state.form, ...action.payload };
    },
    resetCertiState() {
      return initialState;
    },
  },
});

export const {
  updateCertiCategories,
  removeCertiImage,
  removeCertiImageData,
  updateCertiImages,
  updateCertiImagesData,
  updateCertiAvatar,
  updateCertiForm,
  resetCertiState
} = certiFormSlice.actions;
export const certiFormReducer = certiFormSlice.reducer;

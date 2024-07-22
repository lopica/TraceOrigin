import { createSlice } from "@reduxjs/toolkit";

// Define the initial state outside of the createSlice call
const initialState = {
  productName: "",
  categoriesData: [],
  images: [],
  imagesData: [],
  avatar: "",
  form: {},
  avatarIdx: '',
};

const productFormSlice = createSlice({
  name: "productFormSlice",
  initialState: initialState, // Use the initialState defined above
  reducers: {
    updateCategories(state, action) {
      state.categoriesData = action.payload;
    },
    removeImage(state, action) {
      state.images = state.images.filter((_, index) => index !== action.payload);
      if(state.avatarIdx === action.payload) {
        state.avatarIdx = '';
        state.avatar = '';
      }
    },
    removeImageData(state, action) {
      state.imagesData = state.imagesData.filter((_, index) => index !== action.payload);
    },
    updateImages(state, action) {
      state.images = action.payload;
    },
    updateImagesData(state, action) {
      state.imagesData = action.payload;
    },
    updateAvatar(state, action) {
      state.avatar = action.payload.avatar;
      state.avatarIdx = action.payload.idx;
    },
    updateForm(state, action) {
      state.form = { ...state.form, ...action.payload };
    },
    resetState(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  updateCategories,
  removeImage,
  removeImageData,
  updateImages,
  updateImagesData,
  updateAvatar,
  updateForm,
  resetState,
} = productFormSlice.actions;

export const productFormReducer = productFormSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  productName: "",
  categoriesData: [],
  images: [],
  imagesData: [],
  avatar: "",
  form: {},
};

const productEditFormSlice = createSlice({
  name: 'productEditFormSlice',
  initialState: initialState, 
  reducers: {
    updateProductEditCategories(state, action) {
      state.categoriesData = action.payload;
    },
    removeProductEditImage(state, action) {
      state.images = state.images.filter((_, index) => index !== action.payload);
    },
    removeProductEditImageData(state, action) {
      state.imagesData = state.imagesData.filter((_, index) => index !== action.payload);
    },
    updateProductEditImages(state, action) {
      state.images = action.payload;
    },
    updateProductEditImagesData(state, action) {
      state.imagesData = action.payload;
    },
    updateProductEditAvatar(state, action) {
      state.avatar = action.payload;
    },
    updateProductEditForm(state, action) {
      state.form = { ...state.form, ...action.payload };
    },
    resetProductEditState(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  updateProductEditCategories,
  removeProductEditImage,
  removeProductEditImageData,
  updateProductEditImages,
  updateProductEditImagesData,
  updateProductEditAvatar,
  updateProductEditForm,
  resetProductEditState,
} = productEditFormSlice.actions;
export const productEditFormReducer = productEditFormSlice.reducer;

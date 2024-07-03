import { createSlice } from "@reduxjs/toolkit";

const productFormSlice = createSlice({
  name: "productForm",
  initialState: {
    productName: "",
    categoriesData: [],
    images: [],
    imagesData: [],
    avatar: '',
    
  },
  reducers: {
    updateCategories(state, action) {
      state.categoriesData = action.payload;
    },
    removeImage(state, action) {
      state.images = state.images.filter((_, index) => index !== action.payload);
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
      state.avatar = action.payload;
    }
  },
});

export const {
  updateCategories,
  removeImage,
  removeImageData,
  updateImages,
  updateImagesData,
  updateAvatar,
} = productFormSlice.actions;
export const productFormReducer = productFormSlice.reducer;

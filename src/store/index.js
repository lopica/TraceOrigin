import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apis/authApi";
import { setupListeners } from "@reduxjs/toolkit/query";
import { userApi } from "./apis/userApi";
import { productApi } from "./apis/productApi";
import { toastReducer } from './slices/toastSlice'

const store = configureStore({
  reducer: {
    toast: toastReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(authApi.middleware, userApi.middleware, productApi.middleware)
  },
});

setupListeners(store.dispatch);

export { store };
export { useCreateUserMutation, useLoginMutation } from "./apis/authApi";
export { useFetchUserQuery } from "./apis/userApi";
export { useAddProductMutation } from './apis/productApi'
export { showToast, hideToast } from './slices/toastSlice'

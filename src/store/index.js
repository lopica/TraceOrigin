import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apis/authApi";
import { setupListeners } from "@reduxjs/toolkit/query";
import { userApi } from "./apis/userApi";
import { productApi } from "./apis/productApi";
import { toastReducer } from './slices/toastSlice';
import { itemApi } from "./apis/itemApi";
import { itemLogApi } from "./apis/itemLogApi";
import manhTest from "./apis/manhTest";

const store = configureStore({
  reducer: {
    toast: toastReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [itemApi.reducerPath]: itemApi.reducer,
    [itemLogApi.reducerPath]: itemLogApi.reducer,
    [manhTest.reducerPath]: manhTest.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(authApi.middleware, userApi.middleware, productApi.middleware, itemApi.middleware, itemLogApi.middleware, manhTest.middleware)
  },
});

setupListeners(store.dispatch);

export { store };
export { useCreateUserMutation, useLoginMutation, useLogoutMutation } from "./apis/authApi";
export { useFetchUserQuery } from "./apis/userApi";
export { useAddProductMutation, useSearchProductQuery, useViewProductDetailQuery } from './apis/productApi';
export { showToast, hideToast } from './slices/toastSlice';
export { useFetchItemLogsByProductRecognitionQuery, useFetchOriginByItemLogIdQuery, useSearchItemsByProductIdQuery } from './apis/itemApi';
export { useFetchEventByItemLogIdQuery } from './apis/itemLogApi';

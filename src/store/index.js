import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apis/authApi";
import { setupListeners } from "@reduxjs/toolkit/query";
import { userApi } from "./apis/userApi";
import { productApi } from "./apis/productApi";
import { toastReducer } from "./slices/toastSlice";
import { itemApi } from "./apis/itemApi";
import { itemLogApi } from "./apis/itemLogApi";
import { mapApi } from "./apis/mapApi";
import { locationApi } from "./apis/locationApi";
import { categoryApi } from "./apis/categoryApi";
import { classifierApi } from "./apis/classifierApi";
import { registerFormReducer } from "./slices/registerFormSlice";
import { locationDataReducer } from "./slices/locationDataSlice";

const store = configureStore({
  reducer: {
    toast: toastReducer,
    registerForm: registerFormReducer,
    locationData: locationDataReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [itemApi.reducerPath]: itemApi.reducer,
    [itemLogApi.reducerPath]: itemLogApi.reducer,
    [mapApi.reducerPath]: mapApi.reducer,
    [locationApi.reducerPath]: locationApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [classifierApi.reducerPath]: classifierApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      productApi.middleware,
      itemApi.middleware,
      itemLogApi.middleware,
      mapApi.middleware,
      locationApi.middleware,
      categoryApi.middleware,
      classifierApi.middleware
    );
  },
});

setupListeners(store.dispatch);

export { store };
export {
  useCreateUserMutation,
  useLoginMutation,
  useLogoutMutation,
} from "./apis/authApi";
export { useFetchUserQuery } from "./apis/userApi";
export {
  useAddProductMutation,
  useSearchProductQuery,
  useViewProductDetailQuery,
} from "./apis/productApi";
export { showToast, hideToast } from "./slices/toastSlice";
export { updateForm } from "./slices/registerFormSlice";
export {
  updateProvinces,
  updateDistricts,
  updateWards,
  updateCurrentLocationId
} from "./slices/locationDataSlice";
export {
  useFetchItemLogsByProductRecognitionQuery,
  useFetchOriginByItemLogIdQuery,
  useSearchItemsByProductIdQuery,
} from "./apis/itemApi";
export { useFetchEventByItemLogIdQuery } from "./apis/itemLogApi";
export {
  useGetAllProvincesQuery,
  useGetDistrictByProvinceIdQuery,
  useGetWardByDistrictIdQuery,
} from "./apis/locationApi";
export { useGetAllCategoriesQuery } from "./apis/categoryApi";
export { usePredictMutation } from "./apis/classifierApi";

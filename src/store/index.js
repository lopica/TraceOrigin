import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apis/authApi";
import { setupListeners } from "@reduxjs/toolkit/query";
import { userApi } from "./apis/userApi";
import { certificateApi } from "./apis/certificateApi";
import { reportApi } from "./apis/reportApi";
import { productApi } from "./apis/productApi";
import { toastReducer } from "./slices/toastSlice";
import { itemApi } from "./apis/itemApi";
import { itemLogApi } from "./apis/itemLogApi";
import { monitoringApi } from "./apis/monitoringApi";
import { mapApi } from "./apis/mapApi";
import { locationApi } from "./apis/locationApi";
import { categoryApi } from "./apis/categoryApi";
import { classifierApi } from "./apis/classifierApi";
import { registerFormReducer } from "./slices/registerFormSlice";
import { locationDataReducer } from "./slices/locationDataSlice";
import { productFormReducer } from "./slices/productFormSlice";
import { certiFormReducer } from "./slices/certiFormSlice";
import authSliceReducer from "./slices/authSlice";
import { userSliceReducer } from "./slices/userSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import { serialRequestMiddleware } from "./serialRequestMiddleware";
import { productSliceReducer } from "./slices/productSlice";
import { itemSliceReducer } from "./slices/itemSlice";
import { certificateSliceReducer } from "./slices/certificateSlice";
import { productEditFormReducer } from "./slices/productEditFormSlice";
import { elkApi } from "../store/apis/elkApi";
import { thunk } from "redux-thunk";
import { historySearchSliceReducer } from "./slices/historySeach";
import { utilApi } from "./apis/utilApi";
import { customercareApi } from "./apis/customercareApi";
import { supportSystemApi } from "./apis/supportSystemApi";

// Define the persist configuration
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: [
    "authSlice",
    "userSlice",
    "certiForm",
    "productEditForm",
    // 'historySearchSlice',
  ],
};

const rootReducer = combineReducers({
  toast: toastReducer,
  registerForm: registerFormReducer,
  locationData: locationDataReducer,
  productForm: productFormReducer,
  certiForm: certiFormReducer,
  authSlice: authSliceReducer,
  userSlice: userSliceReducer,
  productSlice: productSliceReducer,
  itemSlice: itemSliceReducer,
  certificateSlice: certificateSliceReducer,
  productEditForm: productEditFormReducer,
  historySearchSlice: historySearchSliceReducer,
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  [itemApi.reducerPath]: itemApi.reducer,
  [itemLogApi.reducerPath]: itemLogApi.reducer,
  [mapApi.reducerPath]: mapApi.reducer,
  [locationApi.reducerPath]: locationApi.reducer,
  [categoryApi.reducerPath]: categoryApi.reducer,
  [classifierApi.reducerPath]: classifierApi.reducer,
  [certificateApi.reducerPath]: certificateApi.reducer,
  [elkApi.reducerPath]: elkApi.reducer,
  [monitoringApi.reducerPath]: monitoringApi.reducer,
  [customercareApi.reducerPath]: customercareApi.reducer,
  [supportSystemApi.reducerPath]: supportSystemApi.reducer,
  [utilApi.reducerPath]: utilApi.reducer,
  [reportApi.reducerPath]: reportApi.reducer,
});

// Apply persistReducer wrapper
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/PERSIST",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }).concat(
      authApi.middleware,
      userApi.middleware,
      productApi.middleware,
      itemApi.middleware,
      itemLogApi.middleware,
      mapApi.middleware,
      locationApi.middleware,
      categoryApi.middleware,
      classifierApi.middleware,
      certificateApi.middleware,
      elkApi.middleware,
      monitoringApi.middleware,
      customercareApi.middleware,
      supportSystemApi.middleware,
      utilApi.middleware,
      reportApi.middleware,
      thunk
      // serialRequestMiddleware
    ),
});

setupListeners(store.dispatch);

const persistor = persistStore(store);

export { store, persistor };
export {
  useGetAllTransportsQuery,
  useGetAllEventTypeQuery,
} from "./apis/utilApi";
export { updateQRList, updateAIList } from "./slices/historySeach";
export {
  useCreateUserMutation,
  useLoginMutation,
  useLogoutMutation,
  useSendOtpMutation,
  useCheckEmailExistMutation,
  useForgotPasswordMutation,
} from "./apis/authApi";
export {
  useFetchUserQuery,
  useGetUserDetailQuery,
  useGetUsersQuery,
  useLockUserMutation,
  useUpdateStatusMutation,
} from "./apis/userApi";
export {
  useAddProductMutation,
  useSearchProductQuery,
  useViewProductDetailQuery,
  useDeleteProductByIdMutation,
  useEditProductMutation
} from "./apis/productApi";
export { showToast, hideToast } from "./slices/toastSlice";
export { updateRegisterForm } from "./slices/registerFormSlice";
export {
  updateProvinces,
  updateDistricts,
  updateWards,
  updateCurrentLocationId,
  updateCoordinate,
  updateNewAddress,
  updateVerifyAddress,
} from "./slices/locationDataSlice";
export {
  useFetchItemLogsByProductRecognitionQuery,
  useFetchOriginByItemLogIdQuery,
  useSearchItemsQuery,
  useAddItemMutation,
  useCheckConsignRoleQuery,
  useSendItemOtpMutation,
  useCheckOTPMutation,
  useConsignMutation,
  useIsPendingConsignQuery,
  useGetCertificateMutation,
  useCheckPartyFirstQuery,
  useEndItemLineMutation,
  useGetHistoryQuery,
} from "./apis/itemApi";
export {
  useFetchEventByItemLogIdQuery,
  useCreateTransportEventMutation,
  useAddReceiveLocationMutation,
  useUpdateReceiveLocationMutation,
  useUpdateConsignMutation,
  useUpdateTransportEventMutation,
  useGetItemLogHistoryQuery,
} from "./apis/itemLogApi";
export {
  useGetAllProvincesQuery,
  useGetDistrictByProvinceIdQuery,
  useGetWardByDistrictIdQuery,
} from "./apis/locationApi";
export {
  useGetAllCategoriesQuery,
  useGetCategoryForAdminQuery,
} from "./apis/categoryApi";
export { usePredictMutation } from "./apis/classifierApi";
export {
  useGetCoordinateByAddressMutation,
  useGetAddressByCoordinateMutation,
  useGetAllDistinctCityQuery,
} from "./apis/mapApi";
export {
  updateCategories,
  removeImage,
  updateImages,
  removeImageData,
  updateImagesData,
  updateAvatar,
  updateForm,
  resetState,
} from "./slices/productFormSlice";
export {
  updateCertiCategories,
  removeCertiImage,
  removeCertiImageData,
  updateCertiImages,
  updateCertiImagesData,
  updateCertiAvatar,
  updateCertiForm,
  resetCertiState,
} from "./slices/certiFormSlice";
export {
  updateProductEditCategories,
  removeProductEditImage,
  removeProductEditImageData,
  updateProductEditImages,
  updateProductEditImagesData,
  updateProductEditAvatar,
  updateProductEditForm,
  resetProductEditState,
} from "./slices/productEditFormSlice";
export { requireLogin, loginSuccess } from "./slices/authSlice";
export { updateUser } from "./slices/userSlice";
export {
  updateCategorySearch,
  updateList,
  updateNameSearch,
  updateProductDetail,
} from "./slices/productSlice";
export {
  updateItemDetail,
  updateItemList,
  updateItemLine,
  updateConsignForm,
  updateCancelForm,
  updateCertificate,
  updateReceiveForm,
} from "./slices/itemSlice";
export {
  useGetListManuToVerifyQuery,
  useGetListCertificateByManuIdQuery,
  useAddCertificateMutation,
  useGetCertificateByIdQuery,
  useSendRequestVerifyCertMutation,
  useDeleteCertCertIdMutation,
} from "./apis/certificateApi";
export { useGetNumberVisitsAllTimeQuery } from "./apis/elkApi";
export {
  useGetListReportsQuery,
  useAddNewReportsMutation,
  useReplyReportMutation,
} from "./apis/reportApi";

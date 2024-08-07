import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CONSTANTS } from "../../services/Constants";

// DEV ONLY!!!
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const productApi = createApi({
  reducerPath: "product",
  baseQuery: fetchBaseQuery({
    baseUrl: `${CONSTANTS.domain}/product`,
    credentials: "include",
    // fetchFn: async (...args) => {
    //   // REMOVE FOR PRODUCTION
    //   await pause(3000);
    //   return fetch(...args);
    // },
  }),
  endpoints(builder) {
    return {
      addProduct: builder.mutation({
        invalidatesTags: ['Product'],
        query: (newProduct) => {
          return {
            url: "/addProduct",
            method: "POST",
            body: {
              ...newProduct,
            },
            responseHandler: (response) => {
              return response.text();
            },
          };
        },
      }),
      searchProduct: builder.query({
        providesTags: ['Product'],
        query: (request) => {
          return {
            url: "/findAllProductByManufacturerId",
            method: "POST",
            body: request
          };
        },
      }),
      viewProductDetail: builder.query({
        query: (productId) => {
          return {
            url: "/findProductDetailById",
            method: "POST",
            body: {
              id: productId,
            },
          };
        },
      }),
      deleteProductById: builder.mutation({
        query: (productId) => {
          return {
            url: "/deleteProductById",
            method: "POST",
            body: {
              id: productId,
            },
          };
        },
      }),
      countRegisteredProduct: builder.query({
        query: () => {
          return {
            url: "/countRegisteredProduct",
            method: "GET",
          };
        },
      }),
      ViewProductByManufacturerId: builder.query({
        query: (data) => {
          return {
            url: "/ViewProductByManufacturerId",
            method: "POST",
            body: {
              id: data.id,
              categoryId: data.categoryId || 0, 
            },
          };
        },
      }),
      saveFileAI: builder.mutation({
        query: ({weights, classNames, model, description}) => {
          const formData = new FormData();
          if (weights) {
            formData.append("weights", weights);
          }
          if (classNames) {
            formData.append("classNames", classNames);
          }
          if (model) {
            formData.append("model", model);
          }
          formData.append("description", description || "");

          return {
            url: "/saveFileAI",
            method: "POST",
            body: formData,
            responseHandler: (res) => res.text(),
          };
        },
      }),
      saveModel3D: builder.mutation({
        query: ({ productId, file3D }) => {
          console.log(productId);
          const formData = new FormData();
          formData.append("file3D", file3D); 
          return {
            url: `/saveModel3D/${productId}`, 
            method: "POST",
            body: formData,
            responseHandler: (res) => res.text(),
          };
        },
      }),
      getimageRequest: builder.query({
        query: (data) => {
          return {
            url: "/getImageRequest",
            method: "POST",
            body: {
              orderBy: data.orderBy || "productId",
              productName: data.productName || "",
              manufactorName: data.manufactorName || "",
              page: data.page || 0,
              size: data.size || 10,
              isDesc: data.isDesc,
            },
          };
        },
      }),
      requestScanImage: builder.mutation({
        query: (data) => {
          return {
            url: "/requestScanImage",
            method: "POST",
            body: {
              productId: data.productId,
              image: data.image
            },
          };
        },
      }),
      requestScanImage: builder.mutation({
        query: (data) => {
          return {
            url: "/requestScanImage",
            method: "POST",
            body: {
              productId: data.productId,
              image: data.image
            },
          };
        },
      }),
      approvalImageRequest: builder.mutation({
        query: (data) => {
          return {
            url: "/approvalImageRequest",
            method: "POST",
            body: {
              type: data.type,
              productId: data.productId
            },
          };
        },
      }),
      getImageHadUpload: builder.query({
        query: (data) => {
          return {
            url: "/getImageHadUpload",
            method: "POST",
            body: {
              productId: data.productId
            },
          };
        },
      }),
      editProduct: builder.mutation({
        invalidatesTags: ['Product'],
        query: (newProduct) => {
          return {
            url: "/editProduct",
            method: "POST",
            body: {
              ...newProduct,
            },
            responseHandler: (response) => {
              return response.text();
            },
          };
        },
      }),
    };
  },
});

export { productApi };
export const {
  useAddProductMutation,
  useSearchProductQuery,
  useViewProductDetailQuery,
  useDeleteProductByIdMutation,
  useCountRegisteredProductQuery,
  useViewProductByManufacturerIdQuery,
  useSaveFileAIMutation,
  useSaveModel3DMutation,
  useGetimageRequestQuery,
  useRequestScanImageMutation,
  useApprovalImageRequestMutation,
  useGetImageHadUploadQuery,
  useEditProductMutation
} = productApi;

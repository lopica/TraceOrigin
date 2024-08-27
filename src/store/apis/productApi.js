import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CONSTANTS } from "../../services/Constants";


const productApi = createApi({
  reducerPath: "product",
  baseQuery: fetchBaseQuery({
    baseUrl: `${CONSTANTS.domain}/product`,
    // credentials: "include",
    fetchFn: async (input, init, ...args) => {
      // REMOVE FOR PRODUCTION
      // await pause(3000);

      // Determine the endpoint based on the URL or some other method
      const url = typeof input === "string" ? input : input.url;
      if (!url.includes("/findProductDetailByIdPublic") ) {
        // Customize fetch options for this specific endpoint
        init = {
          ...init,
          credentials: "include", // Include credentials specifically for this endpoint
        };
      }

      return fetch(input, init, ...args);
    },
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
      viewProductDetailPublic: builder.query({
        query: (productId) => {
          return {
            url: "/findProductDetailByIdPublic",
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
      disableProductById: builder.mutation({
        invalidatesTags: ['Product'],
        query: (id) => {
          return {
            url: "/disableProductById",
            method: "POST",
            body: {
              id: id || -1
            },
            responseHandler: (response) => {
              return response.text();
            },
          };
        },
      }),
      checkStatus: builder.mutation({
        invalidatesTags: ['Product'],
        query: (id) => {
          return {
            url: `/checkStatus`,
            method: "POST",
            body: {
              id: id || -1
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
  useEditProductMutation,
  useDisableProductByIdMutation,
  useCheckStatusMutation,
  useViewProductDetailPublicQuery,
} = productApi;

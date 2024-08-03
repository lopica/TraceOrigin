import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CONSTANTS } from "../../services/Constants";
import { requireLogin } from "../slices/authSlice";

// DEV ONLY!!!
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const categoryApi = createApi({
  reducerPath: "category",
  baseQuery: fetchBaseQuery({
    baseUrl: `${CONSTANTS.domain}/category`,
    credentials: "include",
    fetchFn: async (...args) => {
      // REMOVE FOR PRODUCTION
      await pause(3000);
      return fetch(...args);
    },
  }),
  endpoints(builder) {
    return {
      getAllCategories: builder.query({
        query: () => {
          return {
            url: "/findAll",
            method: "GET",
          };
        },
      }),
      getCategoryForAdmin: builder.query({
        query: () => {
          return {
            url: "/getCategoryForAdmin",
            method: "GET",
          };
        },
      }),
      addListCategory: builder.mutation({
        query: (categories) => ({
          url: "/addListCategory",
          method: "POST",
          body: categories,
        }),
      }),
      getNextId: builder.query({
        query: () => {
          return {
            url: "/getNextId",
            method: "GET",
          };
        },
      }),
      findCategoryByManufacturer: builder.query({
        query: (id) => ({
          url: "/findCategoryByManufacturer",
          method: "POST",
          body: 
          {
            id: id
          },
        }),
      }),
    };
  },
});

export { categoryApi };
export const { useGetAllCategoriesQuery, useGetCategoryForAdminQuery, useAddListCategoryMutation, useGetNextIdQuery, useFindCategoryByManufacturerQuery } = categoryApi;

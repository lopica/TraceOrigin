import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CONSTANTS } from "../../services/Constants";

// DEV ONLY!!!
// const pause = (duration) => {
//   return new Promise((resolve) => {
//     setTimeout(resolve, duration);
//   });
// };

const userApi = createApi({
  reducerPath: "user",
  baseQuery: fetchBaseQuery({
    baseUrl: `${CONSTANTS.domain}/user`,
    // baseUrl: "http://localhost:3001",
    credentials: "include",
    // fetchFn: async (...args) => {
    //   // REMOVE FOR PRODUCTION
    //   await pause(3000);
    //   return fetch(...args);
    // },
  }),
  endpoints(builder) {
    return {
      fetchUser: builder.query({
        providesTags: ["Login"],
        query: () => {
          return {
            url: "/me",
            method: "GET",
          };
        },
      }),
      getUserDetail: builder.query({
        query: (userId) => {
          return {
            url: "/getUserById",
            method: "POST",
            body: {
              userId: userId,
            },
          };
        },
      }),
      getDetailUser: builder.query({
        query: (id) => {
          return {
            url: "/getDetailUser",
            method: "POST",
            body: {
              id: id,
            },
          };
        },
      }),
      getUsers: builder.query({
        query: (options) => ({
          url: "/getDataToTable",
          method: "POST",
          body: {
            email: options.email || "",
            roleId: options.roleId || "",
            status: options.status || "",
            dateFrom: options.dateFrom || "",
            dateTo: options.dateTo || "",
            orderBy: options.orderBy || "createAt",
            isAsc: options.isAsc || "true",
            page: options.page || "0",
            size: options.size || "10",
            city: options.city || "",
          },
        }),
      }),
      lockUser: builder.mutation({
        query: (options) => ({
          url: "/lockUser",
          method: "POST",
          body: {
            userId: options.userId || "0",
            status: options.status || "0",
          },
        }),
      }),
      updateStatus: builder.mutation({
        query: (options) => ({
          url: "/updateStatus",
          method: "POST",
          body: {
            id: options.id || "0",
            status: options.status || "0",
          },
        }),
      }),
      countRegisteredUser: builder.query({
        query: () => {
          return {
            url: "/countRegisteredUser",
            method: "GET",
          };
        },
      }),
      searchAllManufacturer: builder.query({
        query: () => {
          return {
            url: "/searchAllManufacturer",
            method: "GET",
          };
        },
      }),
      top5OrgNames: builder.query({
        query: () => {
          return {
            url: "/top5OrgNames",
            method: "GET",
          };
        },
      }),
      updateOrgImage: builder.mutation({
        query: (options) => {
          return {
            url: "/updateOrgImage",
            method: "POST",
            body: {
              file: options.file || "",
            },
          };
        },
      }),
      updateAvatar: builder.mutation({
        query: (options) => {
          return {
            url: "/updateAvatar",
            method: "POST",
            body: {
              file: options.file || "",
            },
          };
        },
      }),
      updateDescription: builder.mutation({
        query: (options) => {
          return {
            url: "/updateDescription",
            method: "POST",
            body: {
              description: options.description || "",
            },
          };
        },
      }),
      deleteSupporter: builder.mutation({
        query: (options) => {
          return {
            url: "/deleteSupporter",
            method: "POST",
            body: {
              id: options.id,
            },
          };
        },
      }),
      listAllCustomerSupport: builder.query({
        query: (options) => {
          return {
            url: "/listAllCustomerSupport",
            method: "POST",
            body: {
              pageNumber: options.pageNumber,
              pageSize: options.pageSize,
              email: options.email || "",
              type: options.type || "",
            },
          };
        },
      }),
    };
  },
});

export { userApi };
export const {
  useFetchUserQuery,
  useGetUserDetailQuery,
  useGetDetailUserQuery,
  useGetUsersQuery,
  useLockUserMutation,
  useUpdateStatusMutation,
  useCountRegisteredUserQuery,
  useSearchAllManufacturerQuery,
  useTop5OrgNamesQuery,
  useUpdateOrgImageMutation,
  useUpdateAvatarMutation,
  useUpdateDescriptionMutation,
  useDeleteSupporterMutation,
  useListAllCustomerSupportQuery
} = userApi;

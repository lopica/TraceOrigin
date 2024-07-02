import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// DEV ONLY!!!
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const userApi = createApi({
  reducerPath: "user",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/user",
    // baseUrl: "http://localhost:3001",
    credentials: 'include',
    fetchFn: async (...args) => {
      // REMOVE FOR PRODUCTION
      await pause(2000);
      return fetch(...args);
    },
    responseHandler: async (response) => {
      if (response.headers.get("Content-Type")?.includes("application/json")) {
        return await response.json(); // Parse as JSON if content-type is json
      } else {
        return response.text(); // Otherwise, return as text
      }
    },
  }),
  endpoints(builder) {
    return {
      fetchUser: builder.query({
        query: () => {
          return {
            url: "/me",
            method: "GET",
          };
        },
      }),
      getUserDetail: builder.query({
        query: (userId) => {
          return{
            url: '/getUserById',
            method: 'POST',
            body:{
              "userId" : userId
            }
          }
        }
      }),
      getUsers: builder.query({
        query: (options) => ({
          url: '/getDataToTable',
          method: 'POST',
          body: {
            email: options.email || "",
            roleId: options.roleId || "",
            status: options.status || "",
            dateFrom: options.dateFrom || "",
            dateTo: options.dateTo || "",
            orderBy: options.orderBy || "createAt",
            isAsc: options.isAsc || "true",
            page: options.page || "0",
            size: options.size || "10"
          }
        }),
      }),
      lockUser: builder.mutation({
        query: (options) => ({
          url: '/lockUser',
          method: 'POST',
          body: {
            userId: options.userId || "0",
            status: options.status || "0"
          }
        }),
      }),
    };
  },
});

export { userApi };
export const { useFetchUserQuery, useGetUserDetailQuery, useGetUsersQuery , useLockUserMutation } = userApi;

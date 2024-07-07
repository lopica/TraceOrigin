import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CONSTANTS } from "../../services/Constants";

// DEV ONLY!!!
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const authApi = createApi({
  reducerPath: "auth",
  baseQuery: fetchBaseQuery({
    baseUrl: `${CONSTANTS.domain}/auth`,
    credentials: "include",
    // baseUrl: "http://localhost:3001",
    // fetchFn: async (...args) => {
    //   // REMOVE FOR PRODUCTION
    //   await pause(3000);
    //   return fetch(...args);
    // },
  }),

  endpoints(builder) {
    return {
      createUser: builder.mutation({
        invalidatesTags: (result, error, input) => {
          return [{ type: "Users", id: input.email }];
        },
        query: (newUser) => {
          return {
            url: "/signup",
            // url: "/users",
            method: "POST",
            body: {
              ...newUser,
            },
          };
        },
      }),
      login: builder.mutation({
        query: (input) => {
          return {
            url: "/login",
            method: "POST",
            body: { ...input },
            responseHandler: res => res.text()
          };
        },
      }),
      logout: builder.mutation({
        query: () => {
          return {
            url: "/logout",
            method: "POST",
            responseHandler: res => res.text()
          };
        },
      }),
    };
  },
});

export const { useCreateUserMutation, useLoginMutation, useLogoutMutation } =
  authApi;
export { authApi };

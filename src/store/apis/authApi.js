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
    // credentials: "include",
    fetchFn: async (input, init, ...args) => {
      // REMOVE FOR PRODUCTION
      // await pause(3000);

      // Determine the endpoint based on the URL or some other method
      const url = typeof input === "string" ? input : input.url;
      if (
        url.includes("/login") ||
        url.includes("/logout") ||
        url.includes("/changePassword")
      ) {
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
            responseHandler: (res) => res.text(),
          };
        },
      }),
      login: builder.mutation({
        invalidatesTags: ["addProduct"],
        query: (input) => {
          return {
            url: "/login",
            method: "POST",
            body: { ...input },
            responseHandler: (res) => res.text(),
          };
        },
      }),
      logout: builder.mutation({
        query: () => {
          return {
            url: "/logout",
            method: "POST",
            responseHandler: (res) => res.text(),
          };
        },
      }),
      sendOtp: builder.mutation({
        query: (request) => {
          return {
            url: "/sendEmailVerify",
            method: "POST",
            body: request,
            responseHandler: (res) => res.text(),
          };
        },
      }),
      checkEmailExist: builder.mutation({
        query: (request) => {
          return {
            url: "/checkMailExist",
            method: "POST",
            body: request,
            responseHandler: (res) => res.text(),
          };
        },
      }),
      checkOrgNameExist: builder.mutation({
        query: (request) => {
          return {
            url: "/checkOrgNameExist",
            method: "POST",
            body: request,
            responseHandler: (res) => res.text(),
          };
        },
      }),
      forgotPassword: builder.mutation({
        query: (input) => {
          return {
            url: "/forgotPassword",
            method: "POST",
            body: { ...input },
            responseHandler: (res) => res.text(),
          };
        },
      }),
      changePassword: builder.mutation({
        query: (input) => ({
          url: "/changePassword",
          method: "POST",
          body: { ...input },
          responseHandler: (res) => res.text(),
        }),
      }),
    };
  },
});

export const {
  useCreateUserMutation,
  useLoginMutation,
  useLogoutMutation,
  useSendOtpMutation,
  useCheckEmailExistMutation,
  useCheckOrgNameExistMutation,
  useForgotPasswordMutation,
  useChangePasswordMutation,
} = authApi;
export { authApi };

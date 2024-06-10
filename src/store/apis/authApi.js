import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// DEV ONLY!!!
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const authApi = createApi({
  reducerPath: "auth",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/auth",
    credentials: 'include',
    // baseUrl: "http://localhost:3001",
    fetchFn: async (...args) => {
      // REMOVE FOR PRODUCTION
      await pause(3000);
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
              role: 2,
              country: 'Vietnam'
            },
          };
        },
      }),
      login: builder.mutation({
        query: (input) => {
          return {
            url: "/login",
            method: "POST",
            body: {...input},
          };
        },
      }),
      logout: builder.mutation({
        query: () => {
          return {
            url: '/logout',
            method: 'POST',
          }
        }
      })
    };
  },
});

export const { useCreateUserMutation, useLoginMutation, useLogoutMutation } = authApi;
export { authApi };

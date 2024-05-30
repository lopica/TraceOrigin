import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// DEV ONLY!!!
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const usersApi = createApi({
  reducerPath: "users",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/auth",
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
              email: newUser.email,
              firstName: newUser.firstName,
              lastName: newUser.lastName,
              role: 2,
              address: newUser.address,
              city: newUser.city,
              country: "Vietnam",
              phone: newUser.phone,
              dateOfBirth: newUser.dateOfBirth,
              password: newUser.password,
            },
          };
        },
      }),
      login: builder.mutation({
        query: (user) => {
          return {
            url: "/login",
            method: "POST",
            body: {
              email: user.email,
              password: user.password,
            },
          };
        },
      }),
    };
  },
});

export const { useCreateUserMutation, useLoginMutation } = usersApi;
export { usersApi };

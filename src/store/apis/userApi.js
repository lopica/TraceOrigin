import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CONSTANTS } from "../../services/Constants";

// DEV ONLY!!!
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const userApi = createApi({
  reducerPath: "user",
  baseQuery: fetchBaseQuery({
    baseUrl: `${CONSTANTS.domain}/user`,
    // baseUrl: "http://localhost:3001",
    credentials: 'include',
    fetchFn: async (...args) => {
      // REMOVE FOR PRODUCTION
      await pause(3000);
      return fetch(...args);
    },
    responseHandler: (response) => {
      if (response.headers.get("Content-Type")?.includes("application/json")) {
        return response.json(); // Parse as JSON if content-type is json
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
    };
  },
});

export const { useFetchUserQuery } = userApi;
export { userApi };

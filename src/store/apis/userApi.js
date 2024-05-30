import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// DEV ONLY!!!
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const userApi = createApi({
  reducerPath: "users",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/user",
    // baseUrl: "http://localhost:3001",
    credentials: 'include',
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
    prepareHeaders: (headers) => {
      // bạn có thể thêm headers ở đây nếu cần, ví dụ xác thực
      return headers;
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

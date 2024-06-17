import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const manhTest = createApi({
  reducerPath: 'user',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8080/api/user',
    credentials: 'include',
    fetchFn: async (...args) => {
      await pause(3000);
      return fetch(...args);
    },
    responseHandler: async (response) => {
      if (response.headers.get("Content-Type")?.includes("application/json")) {
        return await response.json();
      } else {
        return response.text();
      }
    },
  }),
  endpoints(builder) {
    return {
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
      })
    };
  }
});

export const { useGetUsersQuery } = manhTest;
export default manhTest;

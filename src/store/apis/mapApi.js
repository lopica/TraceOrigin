import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CONSTANTS } from "../../services/Constants";

// DEV ONLY!!!
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const mapApi = createApi({
  reducerPath: "map",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.opencagedata.com/geocode/v1",
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
      getMap: builder.query({
        query: ({address}) => {
          return {
            url: `/v1/json?q=${encodeURIComponent(address)}&key=${CONSTANTS.openCage_API_KEY}`,
            method: 'GET',
          }
        }
      })
    };
  },
});

export const { useGetMapQuery } = mapApi;
export { mapApi };

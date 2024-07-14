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
    baseUrl: `${CONSTANTS.domain}/location`,
    // mode: "no-cors",
    fetchFn: async (...args) => {
      // REMOVE FOR PRODUCTION
      await pause(3000);
      return fetch(...args);
    },
    // responseHandler: async (response) => {
    //   if (response.headers.get("Content-Type")?.includes("application/json")) {
    //     return await response.json(); // Parse as JSON if content-type is json
    //   } else {
    //     return response.text(); // Otherwise, return as text
    //   }
    // },
  }),
  
  endpoints(builder) {
    return {
      getAddressByCoordinate: builder.mutation({
        query: (coordinate) => {
          return {
            url: `/verifyCoordinates`,
            method: 'POST',
            body: coordinate
          }
        }
      }),
      getCoordinateByAddress: builder.mutation({
        query: (address) => {
          return {
            url: '/verifyLocation',
            method: 'POST',
            body: address
          }
        }
      }),
      getAllDistinctCity: builder.query({
        query: (address) => {
          return {
            url: '/getAllCity',
            method: 'GET'
          }
        }
      }),
    };
  },
});

export const { useGetCoordinateByAddressMutation, useGetAddressByCoordinateMutation , useGetAllDistinctCityQuery } = mapApi;
export { mapApi };

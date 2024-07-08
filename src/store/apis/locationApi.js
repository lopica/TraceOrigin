import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CONSTANTS } from "../../services/Constants";

// DEV ONLY!!!
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const locationApi = createApi({
  reducerPath: "location",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://esgoo.net/api-tinhthanh",
    // mode: "no-cors",
    // fetchFn: async (...args) => {
    //   // REMOVE FOR PRODUCTION
    //   await pause(3000);
    //   return fetch(...args);
    // },
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
      getAllProvinces: builder.query({
        query: () => {
          return {
            url: `/1/0.htm`,
            method: 'GET',
          }
        }
      }),
      getDistrictByProvinceId: builder.query({
        query: (province_id) => {
          return {
            url: `/2/${province_id}.htm`,
            method: 'GET',
          }
        }
      }),
      getWardByDistrictId: builder.query({
        query: (district_id) => {
          return {
            url: `/3/${district_id}.htm`
          }
        }
      })
    };
  },
});

export const { useGetAllProvincesQuery, useGetDistrictByProvinceIdQuery, useGetWardByDistrictIdQuery } = locationApi;
export { locationApi };

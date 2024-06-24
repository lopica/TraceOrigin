import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// DEV ONLY!!!
const pause = (duration) => {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
};

const categoryApi = createApi({
    reducerPath: 'category',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080/api/category',
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
    }),
    endpoints(builder) {
        return {
            getAllCategories: builder.query({
                query: () => {
                    return {
                        url: '/findAll',
                        method: 'GET'
                    }
                }
            })
        }
    }
})

export {categoryApi}
export const { useGetAllCategoriesQuery } = categoryApi
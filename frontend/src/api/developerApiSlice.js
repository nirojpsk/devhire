import apiSlice from "./apiSlice";
import { DEVELOPER_URL } from "../constants";


const developerApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createDeveloperProfile: builder.mutation({
            query: (data) => ({
                url: `${DEVELOPER_URL}/profile`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['DeveloperProfile'],
        }),

        getDeveloperProfile: builder.query({
            query: () => ({
                url: `${DEVELOPER_URL}/profile`,
            }),
            providesTags: ['DeveloperProfile'],
        }),

        updateDeveloperProfile: builder.mutation({
            query: (data) => ({
                url: `${DEVELOPER_URL}/profile`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['DeveloperProfile'],
        }),
    }),
});

export const {useCreateDeveloperProfileMutation, useGetDeveloperProfileQuery, useUpdateDeveloperProfileMutation} = developerApiSlice;
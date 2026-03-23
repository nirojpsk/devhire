import { CLIENT_URL } from "../constants";
import apiSlice from "./apiSlice";

const clientApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createClientProfile: builder.mutation({
            query: (data) => ({
                url: `${CLIENT_URL}/profile`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["ClientProfile"],
        }),

        getClientProfile: builder.query({
            query: () => ({
                url: `${CLIENT_URL}/profile`,
            }),
            providesTags: ["ClientProfile"],
        }),

        updateClientProfile: builder.mutation({
            query: (data) => ({
                url: `${CLIENT_URL}/profile`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["ClientProfile"],
        }),
    }),
});

export const {
    useCreateClientProfileMutation,
    useGetClientProfileQuery,
    useUpdateClientProfileMutation,
} = clientApiSlice;
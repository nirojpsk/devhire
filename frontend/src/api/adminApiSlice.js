import { ADMIN_URL } from "../constants";
import apiSlice from "./apiSlice";

const adminApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllUsers: builder.query({
            query: () => ({
                url: `${ADMIN_URL}/users`,
            }),
            providesTags: ["User"],
        }),

        getAllProjectsAdmin: builder.query({
            query: () => ({
                url: `${ADMIN_URL}/projects`,
            }),
            providesTags: ["Project"],
        }),

        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `${ADMIN_URL}/user/${userId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["User"],
        }),

        deleteProjectAdmin: builder.mutation({
            query: (projectId) => ({
                url: `${ADMIN_URL}/project/${projectId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Project"],
        }),

        banUser: builder.mutation({
            query: (userId) => ({
                url: `${ADMIN_URL}/ban/${userId}`,
                method: "PUT",
            }),
            invalidatesTags: ["User"],
        }),

        getUserProfileAdmin: builder.query({
            query: (userId) => ({
                url: `${ADMIN_URL}/user/${userId}/profile`,
            }),
        }),
    }),
});

export const {
    useGetAllUsersQuery,
    useGetAllProjectsAdminQuery,
    useDeleteUserMutation,
    useDeleteProjectAdminMutation,
    useBanUserMutation,
    useGetUserProfileAdminQuery,
    useLazyGetUserProfileAdminQuery,
} = adminApiSlice;

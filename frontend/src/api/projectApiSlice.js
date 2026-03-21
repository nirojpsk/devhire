import { PROJECT_URL } from "../constants";
import apiSlice from "./apiSlice";

const projectApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        createProject: builder.mutation({
            query: (data) => ({
                url: `${PROJECT_URL}`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Project'],
        }),

        getProjects: builder.query({
            query: () => ({
                url: `${PROJECT_URL}`
            }),
            providesTags: ['Project'],
        }),

        getProjectById: builder.query({
            query: (projectId) => ({
                url: `${PROJECT_URL}/${projectId}`,
            }),
            providesTags: ['Project'],
        }),

        getMyProjects: builder.query({
            query: () => ({
                url: `${PROJECT_URL}/my-projects`,
            }),
            providesTags: ['Project'],
        }),
        updateProject: builder.mutation({
            query: ({ projectId, data }) => ({
                url: `${PROJECT_URL}/${projectId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Project'],
        }),
        deleteProject: builder.mutation({
            query: (projectId) => ({
                url: `${PROJECT_URL}/${projectId}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Project'],
        }),

    }),
});

export const { useCreateProjectMutation, useGetMyProjectsQuery, useGetProjectByIdQuery, useGetProjectsQuery, useUpdateProjectMutation, useDeleteProjectMutation } = projectApiSlice;
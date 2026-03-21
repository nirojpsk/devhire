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

    }),
});

export const {useCreateProjectMutation, useGetMyProjectsQuery, useGetProjectByIdQuery, useGetProjectsQuery} = projectApiSlice;
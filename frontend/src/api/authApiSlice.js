import { USER_URL } from "../constants";
import apiSlice from "./apiSlice";

const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        register: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/register`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),

        verifyEmail: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/verify-email`,
                method: 'POST',
                body: data,
            }),
        }),

        resendVerificationEmail: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/resend-verification-email`,
                method: 'POST',
                body: data,
            }),
        }),

        login: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/login`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),

        logout: builder.mutation({
            query: () => ({
                url: `${USER_URL}/logout`,
                method: 'POST',
            }),
            invalidatesTags: ['User'],
        }),

        getCurrentUser: builder.query({
            query: () => ({
                url: `${USER_URL}/me`,
            }),
            providesTags: ['User'],
        }),
        changePassword: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/change-password`,
                method: 'PUT',
                body: data,
            }),
        }),
    }),
});

export const {
    useRegisterMutation,
    useVerifyEmailMutation,
    useResendVerificationEmailMutation,
    useLoginMutation,
    useLogoutMutation,
    useChangePasswordMutation,
    useGetCurrentUserQuery,
} = authApiSlice;

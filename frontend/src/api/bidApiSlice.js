import { BID_URL } from "../constants";
import apiSlice from "./apiSlice";

const bidApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        placeBid: builder.mutation({
            query: ({ projectId, data }) => ({
                url: `${BID_URL}/${projectId}`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Bid', 'Project'],
        }),

        getBidsForProject: builder.query({
            query: (projectId) => ({
                url: `${BID_URL}/project/${projectId}`,
            }),
            providesTags: ['Bid'],
        }),

        getBidById: builder.query({
            query: (bidId) => ({
                url: `${BID_URL}/${bidId}`,
            }),
            providesTags: ['Bid'],
        }),

        getMyBids: builder.query({
            query: () => ({
                url: `${BID_URL}/my-bids`,
            }),
            providesTags: ['Bid'],
        }),

        getClientBids: builder.query({
            query: () => ({
                url: `${BID_URL}/client/all`,
            }),
            providesTags: ['Bid'],
        }),

        updateBid: builder.mutation({
            query: ({ bidId, data }) => ({
                url: `${BID_URL}/${bidId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Bid'],
        }),

        deleteBid: builder.mutation({
            query: (bidId) => ({
                url: `${BID_URL}/${bidId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Bid'],
        }),

        acceptBid: builder.mutation({
            query: (bidId) => ({
                url: `${BID_URL}/${bidId}/accept`,
                method: 'PUT',
            }),
            invalidatesTags: ['Bid', 'Project'],
        }),

        rejectBid: builder.mutation({
            query: (bidId) => ({
                url: `${BID_URL}/${bidId}/reject`,
                method: 'PUT',
            }),
            invalidatesTags: ['Bid'],
        }),

    }),
});

export const {
    usePlaceBidMutation,
    useGetBidsForProjectQuery,
    useGetBidByIdQuery,
    useGetMyBidsQuery,
    useGetClientBidsQuery,
    useUpdateBidMutation,
    useDeleteBidMutation,
    useAcceptBidMutation,
    useRejectBidMutation,
} = bidApiSlice;

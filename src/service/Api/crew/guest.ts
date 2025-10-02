import {
  Guest,
  GuestRequest,
  GuestResponse
} from "@/types/crew/guest";
import { api } from "../api";

export const guestsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getGuests: build.query<GuestResponse,void>({
      query: () => "/guest",
      providesTags: ["Guest"],
    }),

    // Get single guest by ID
    getGuestById: build.query<GuestResponse, number>({
      query: (id) => `/guest/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Guest", id }],
    }),

    // Add guest
    addGuest: build.mutation<Guest, GuestRequest>({
      query: (guestData) => ({
        url: "/guest",
        method: "POST",
        body: guestData,
      }),
      invalidatesTags: ["Guest"],
    }),

    // Update guest
    updateGuest: build.mutation<
      Guest,
      { id: number; data: Partial<GuestRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/guest/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Guest", id }],
    }),

    // Delete guest
    deleteGuest: build.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `/guest/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Guest"],
    }),

importGuestsFile: build.mutation<GuestResponse, { guests: GuestRequest[] }>({
            query: (Data) => ({
                url: '/guest/bulk',
                method: 'POST',
                body:Data,
            }),
            invalidatesTags: ["Guest"],
        }),


  }),
});

export const {
  useGetGuestsQuery,
  useGetGuestByIdQuery,
  useAddGuestMutation,
  useUpdateGuestMutation,
  useDeleteGuestMutation,
  useImportGuestsFileMutation
} = guestsApi;

// src/store/api/participantsApi.ts

import { api } from "@/service/api";
import { Participant } from "@/types/table";

export const participantsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getParticipants: builder.query<Participant[], void>({
      query: () => ({
        url: "/secure-handle",
        method: "POST",
        body: { route: "participants.index" },
      }),
      providesTags: ["Participants"],
    }),
    getParticipantById: builder.query<Participant, number>({
      query: (id) => ({
        url: "/secure-handle",
        method: "POST",
        body: { route: "participants.show", id },
      }),
      providesTags: (result, error, id) => [{ type: "Participants", id }],
    }),
    addParticipant: builder.mutation<any, Partial<Participant>>({
      query: (data) => ({
        url: "/secure-handle",
        method: "POST",
        body: { route: "participants.store", ...data },
      }),
      invalidatesTags: ["Participants"],
    }),
    updateParticipant: builder.mutation<any, { id: number; data: Partial<Participant> }>({
      query: ({ id, data }) => ({
        url: "/secure-handle",
        method: "POST",
        body: { route: "participants.update", id, ...data },
      }),
      invalidatesTags: ["Participants"],
    }),
    deleteParticipant: builder.mutation<any, number>({
      query: (id) => ({
        url: "/secure-handle",
        method: "POST",
        body: { route: "participants.destroy", id },
      }),
      invalidatesTags: ["Participants"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetParticipantsQuery,
  useGetParticipantByIdQuery,
  useAddParticipantMutation,
  useUpdateParticipantMutation,
  useDeleteParticipantMutation,
} = participantsApi;

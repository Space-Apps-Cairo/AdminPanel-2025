import { api } from "./api";
import {
  Participant,
  ParticipantRequest,
} from "@/types/participants";

export const participantsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllParticipants: build.query<{
      data: Participant[];
      total: number;
      current_page: number;
      total_pages: number;
      per_page: number;
      count: number;
    }, string>({
      query: (queryString) => `/bootcamp-participants${queryString}`,
      providesTags: ["Participant"],
    }),
    getParticipantDetails: build.query<Participant, number>({
      query: (id: number) => `/bootcamp-participants/${id}`,
      transformResponse: (response: { data: Participant }) => response.data ?? {},
      providesTags: ["Participant"],
    }),
    addNewParticipant: build.mutation<{ data: Participant }, ParticipantRequest>({
      query: (participantData) => ({
        url: "/bootcamp-participants",
        method: "POST",
        body: participantData,
      }),
      invalidatesTags: ["Participant"],
    }),
    updateParticipant: build.mutation<
      { data: Participant },
      { id: string; data: Partial<ParticipantRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/bootcamp-participants/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        "Participant",
        { type: "Participant", id: arg.id },
      ],
    }),
    deleteParticipant: build.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/bootcamp-participants/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "Participant",
        { type: "Participant", id },
      ],
    }),
  }),
});

export const {
  useGetAllParticipantsQuery,
  useAddNewParticipantMutation,
  useUpdateParticipantMutation,
  useDeleteParticipantMutation,
  useGetParticipantDetailsQuery,
} = participantsApi;

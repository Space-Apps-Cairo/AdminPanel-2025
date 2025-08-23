import { api } from "./api";
import {
  Participant,
  ParticipantRequest,
  ParticipantResponse,
  ParticipantsResponse,
} from "@/types/participants";

export const participantsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllParticipants: build.query<ParticipantsResponse, void>({
      query: () => "/bootcamp-participants",
      providesTags: ["Participant"],
    }),
    getParticipantDetails: build.query<Participant, number>({
      query: (id: number) => `/bootcamp-participants/${id}`,
      transformResponse: (response: any) => response.data ?? {},
      providesTags: ["Participant"],
    }),
    addNewParticipant: build.mutation<ParticipantResponse, ParticipantRequest>({
      query: (participantData) => ({
        url: "/bootcamp-participants",
        method: "POST",
        body: participantData,
      }),
      invalidatesTags: ["Participant"],
    }),
    updateParticipant: build.mutation<
      ParticipantResponse,
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

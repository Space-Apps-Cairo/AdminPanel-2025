import { api } from "./api";
import { ParticipantPreference, ParticipantPreferenceRequest } from "@/types/preference";

export const preferencesApi = api.injectEndpoints({
  endpoints: (build) => ({
    // preferences
    getAllPreferences: build.query<ParticipantPreference[], void>({
      query: () => "/participant-workshop-preferences",
      providesTags: ["Preference"],
    }),

    getPreferencesByParticipant: build.query<ParticipantPreference[], number>({
      query: (participantId) =>
        `/participant-workshop-preferences/participant/${participantId}`,
      transformResponse: (response: any) => response.data ?? [],
      providesTags: ["Preference"],
    }),

    addNewPreference: build.mutation<
      ParticipantPreference,
      { participant_id: number; workshop_id: number; preference_order: number }
    >({
      query: (preferenceData) => ({
        url: "/participant-workshop-preferences",
        method: "POST",
        body: preferenceData,
      }),
      invalidatesTags: ["Preference"],
    }),

    updatePreference: build.mutation<
      ParticipantPreference,
      { id: number; data: ParticipantPreferenceRequest }
    >({
      query: ({ id, data }) => ({
        url: `/participant-workshop-preferences/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Preference" ],
    }),

    deletePreference: build.mutation<
      { success: boolean; message: string },
      number
    >({
      query: (id) => ({
        url: `/participant-workshop-preferences/${id}`,
        method: "DELETE",
      }),
      invalidatesTags:["Preference"],
    }),
  }),
});

export const {
  useGetAllPreferencesQuery,
  useGetPreferencesByParticipantQuery,
  useAddNewPreferenceMutation,
  useUpdatePreferenceMutation,
  useDeletePreferenceMutation,
} = preferencesApi;

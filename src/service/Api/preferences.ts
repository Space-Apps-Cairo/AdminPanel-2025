import { api } from "./api";
import { ParticipantPreference } from "@/types/preference";

export const preferencesApi = api.injectEndpoints({
  endpoints: (build) => ({
    // preferences
    getAllPreferences: build.query<ParticipantPreference[], void>({
      query: () => "/participant-workshop-preferences",
      providesTags: ["Preference"],
    }),

    getPreferencesByParticipant: build.query<ParticipantPreference[], number>({
      query: (participantId) => `/participant-workshop-preferences/participant/${participantId}`,
      transformResponse: (response: any) => response.data ?? [],
      providesTags: (result, error, id) => [
        { type: "Preference", id: id.toString() },
      ],
    }),

    addNewPreference:build.mutation<ParticipantPreference, { participant_id: number; workshop_id: number; preference_order: number }>({
      query: (preferenceData) => ({
        url: "/participant-workshop-preferences",
        method: "POST",
        body: preferenceData,
      }),
      invalidatesTags: ["Preference"],
    }),

    updatePreference: build.mutation<
      ParticipantPreference,
      { id: number; data: Partial<Omit<ParticipantPreference, "id">> }
      >({
      query: ({ id, data }) => ({
        url: `/participant-workshop-preferences/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        "Preference",
        { type: "Preference", id: arg.id.toString() },
      ],
    }),

    deletePreference: build.mutation<
      { success: boolean; message: string },
      number
    >({
      query: (id) => ({
        url: `/participant-workshop-preferences/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "Preference",
        { type: "Preference", id: id.toString() },
      ],
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

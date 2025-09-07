import {
  NationalitiesRes,
  SingleNationalityRes,
  DeleteNationalityRes,
  CreateNationalityRequest,
  TeamStatus,
  CreateTeamStatusRequest,
  ApiResponse,
  ParticipationStatus,
  CreateParticipationStatusRequest,
} from "@/types/registration";
import { api } from "./api";

export const registrationApi = api.injectEndpoints({
  endpoints: (build) => ({
    // ====== Nationalities ====== //
    getAllNationalities: build.query<NationalitiesRes, void>({
      query: () => "/nationality",
      providesTags: ["Nationalities"],
    }),

    addNationality: build.mutation<SingleNationalityRes, CreateNationalityRequest>({
      query: (nationalityData) => ({
        url: "/nationality",
        method: "POST",
        body: nationalityData,
      }),
      invalidatesTags: ["Nationalities"],
    }),

    updateNationality: build.mutation<
      SingleNationalityRes,
      { id: number | string; data: Partial<CreateNationalityRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/nationality/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Nationalities"],
    }),

    deleteNationality: build.mutation<DeleteNationalityRes, number | string>({
      query: (id) => ({
        url: `/nationality/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Nationalities"],
    }),

    // ====== Team Status ====== //
    getAllTeamStatuses: build.query<ApiResponse<TeamStatus[]>, void>({
      query: () => "/bootcamp-team-status",
      providesTags: ["TeamStatus"],
    }),

    addTeamStatus: build.mutation<
      ApiResponse<TeamStatus>,
      CreateTeamStatusRequest
    >({
      query: (data) => ({
        url: "/bootcamp-team-status",
        method: "POST",
        body: data,
      }),
      transformResponse: (
        response: ApiResponse<{ id: number; label: string; key: string }>
      ) => {
        const { label, ...restOfData } = response.data;
        return {
          ...response,
          data: { ...restOfData, name: label },
        };
      },
      invalidatesTags: ["TeamStatus"],
    }),

    updateTeamStatus: build.mutation<
      ApiResponse<TeamStatus>,
      { id: number; data: CreateTeamStatusRequest }
    >({
      query: ({ id, data }) => ({
        url: `/bootcamp-team-status/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (
        response: ApiResponse<{ id: number; label: string; key: string }>
      ) => {
        const { label, ...restOfData } = response.data;
        return {
          ...response,
          data: { ...restOfData, name: label },
        };
      },
      invalidatesTags: ["TeamStatus"],
    }),

    deleteTeamStatus: build.mutation<ApiResponse<null>, number | number[]>({
      query: (id) => ({
        url: `/bootcamp-team-status/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TeamStatus"],
    }),

    // ====== Participation Status ====== //
    getAllParticipationStatuses: build.query<
      ApiResponse<ParticipationStatus[]>,
      void
    >({
      query: () => "/bootcamp-participation-status",
      providesTags: ["ParticipationStatus"],
    }),

    addParticipationStatus: build.mutation<
      ApiResponse<ParticipationStatus>,
      CreateParticipationStatusRequest
    >({
      query: (data) => ({
        url: "/bootcamp-participation-status",
        method: "POST",
        body: data,
      }),
      transformResponse: (
        response: ApiResponse<{ id: number; label: string; key: string }>
      ) => {
        const { label, ...restOfData } = response.data;
        return {
          ...response,
          data: { ...restOfData, name: label },
        };
      },
      invalidatesTags: ["ParticipationStatus"],
    }),

    updateParticipationStatus: build.mutation<
      ApiResponse<ParticipationStatus>,
      { id: number; data: CreateParticipationStatusRequest }
    >({
      query: ({ id, data }) => ({
        url: `/bootcamp-participation-status/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (
        response: ApiResponse<{ id: number; label: string; key: string }>
      ) => {
        const { label, ...restOfData } = response.data;
        return {
          ...response,
          data: { ...restOfData, name: label },
        };
      },
      invalidatesTags: ["ParticipationStatus"],
    }),

    deleteParticipationStatus: build.mutation<
      ApiResponse<null>,
      number | number[]
    >({
      query: (id) => ({
        url: `/bootcamp-participation-status/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ParticipationStatus"],
    }),
  }),
});

export const {
  useGetAllNationalitiesQuery,
  useAddNationalityMutation,
  useUpdateNationalityMutation,
  useDeleteNationalityMutation,
  useGetAllTeamStatusesQuery,
  useAddTeamStatusMutation,
  useUpdateTeamStatusMutation,
  useDeleteTeamStatusMutation,
  useGetAllParticipationStatusesQuery,
  useAddParticipationStatusMutation,
  useUpdateParticipationStatusMutation,
  useDeleteParticipationStatusMutation,
} = registrationApi;

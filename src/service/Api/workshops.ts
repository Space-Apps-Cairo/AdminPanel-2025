import { api } from "./api";
import {
  Schedule,
  ScheduleRes,
  Workshop,
  WorkshopRes,
  WorkshopsRes,
} from "@/types/workshop";

export const workshopsApi = api.injectEndpoints({
  endpoints: (build) => ({
    // ====== workshops ====== //
    getAllWorkshops: build.query<WorkshopsRes, void>({
      query: () => "/workshops",
      providesTags: ["Workshop"],
    }),
    getWorkshopDetails: build.query<WorkshopRes, string>({
      query: (id) => `/workshop-mangment/${id}`,
      providesTags: (result, error, workshopId) => [
        { type: "Workshop", id: workshopId.toString() },
      ],
    }),
    addNewWorkshop: build.mutation<
      WorkshopRes,
      Omit<Workshop, "id" | "created_at" | "schedules">
    >({
      query: (workshopData) => ({
        url: "/workshops",
        method: "POST",
        body: workshopData,
      }),
      invalidatesTags: ["Workshop"],
    }),

    updateWorkshop: build.mutation<
      WorkshopRes,
      {
        id: string;
        data: Partial<Omit<Workshop, "id" | "created_at" | "schedules">>;
      }
    >({
      query: ({ id, data }) => ({
        url: `/workshops/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        "Workshop",
        { type: "Workshop", id: arg.id },
      ],
    }),
    deleteWorkshop: build.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/workshops/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "Workshop",
        { type: "Workshop", id },
      ],
    }),

    // ====== schedules ====== //
    getWorkshopSchedule: build.query<WorkshopRes, string>({
      query: (id) => `/workshop-schedules/${id}`,
      providesTags: (result, error, workshopId) => [
        { type: "Workshop", id: workshopId.toString() },
      ],
    }),
    addNewSchedule: build.mutation<ScheduleRes, Omit<Schedule, "id">>({
      query: (scheduleData) => ({
        url: "/workshop-schedules",
        method: "POST",
        body: scheduleData,
      }),
      invalidatesTags: (result, error, arg) => [
        "Workshop",
        { type: "Workshop", id: arg.workshop_id?.toString() },
      ],
    }),
    updateSchedule: build.mutation<
      ScheduleRes,
      { id: number; data: Omit<Schedule, "id"> }
    >({
      query: ({ id, data }) => ({
        url: `/workshop-schedules/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        "Workshop",
        { type: "Workshop", id: arg.data.workshop_id?.toString() },
      ],
    }),
    deleteSchedule: build.mutation<
      { success: boolean; message: string },
      number
    >({
      query: (id) => ({
        url: `/workshop-schedules/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Workshop"],
    }),
  }),
});

export const {
  useGetAllWorkshopsQuery,
  useGetWorkshopDetailsQuery,
  useGetWorkshopScheduleQuery,
  useAddNewWorkshopMutation,
  useUpdateWorkshopMutation,
  useDeleteWorkshopMutation,
  useAddNewScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
} = workshopsApi;

import { api } from "./api";
import { WorkshopAttendanceResponse } from "@/types/workshop";
import { AttendeesResponse } from "@/types/workshop";
export const DashboardBootCampApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getWorkshopAttendance: builder.query<WorkshopAttendanceResponse, void>({
      query: () => "/workshop-attendance",
      providesTags: ["BootcampDashboard"],
    }),
    getGovernorateDistribution: builder.query<any, void>({
      query: () => "/governorate",
      providesTags: ["BootcampDashboard"],
    }),
    getAgeDistribution: builder.query<any, void>({
      query: () => "/age",
      providesTags: ["BootcampDashboard"],
    }),
    getWorkshopsAttendees: builder.query<any, void>({
      query: () => "/workshop-attendees",
      providesTags: ["BootcampDashboard"],
    }),
    getAttendeesNumbers: builder.query<AttendeesResponse, void>({
      query: () => "/attendees-numbers",
      providesTags: ["BootcampDashboard"],
    }),
  }),
});

export const {
  useGetWorkshopAttendanceQuery,
  useGetAgeDistributionQuery,
  useGetAttendeesNumbersQuery,
  useGetGovernorateDistributionQuery,
  useGetWorkshopsAttendeesQuery,
} = DashboardBootCampApi;

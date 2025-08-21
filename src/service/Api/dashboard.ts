import { api } from "./api";
import { WorkshopAttendanceResponse } from "@/types/workshop";
import { AttendeesResponse } from "@/types/workshop"
export const DashboardBootCampApi = api.injectEndpoints({
  endpoints: (build) => ({
    getWorkshopAttendance: build.query<WorkshopAttendanceResponse, void>({
      query: () => "/workshop-attendance", 
      providesTags: ["BootcampDashboard"],
    }),
  }),
});

export const attendeesApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAttendeesNumbers: build.query<AttendeesResponse, void>({
      query: () => "/attendees-numbers", 
      providesTags: ["BootcampDashboard"],
    }),
  }),
})

export const workshopApi = api.injectEndpoints({
  endpoints: (build) => ({
    getWorkshopsAttendees: build.query<any, void>({
      query: () => "/workshop-attendees",
      providesTags: ["BootcampDashboard"],
    }),
  }),
})
export const { useGetAttendeesNumbersQuery } = attendeesApi
export const { useGetWorkshopAttendanceQuery } = DashboardBootCampApi;
export const {useGetWorkshopsAttendeesQuery}=workshopApi;

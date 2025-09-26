


import { api } from "../api";

export const HackathonDashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    
    getHackathonInsights: builder.query<any, void>({
      query: () => "/all-hackathon-insights",
      providesTags: ["HackathonDashboard"],
    }),

    
    getStudyLevels: builder.query<any, void>({
      query: () => "/study-levelsses",
      providesTags: ["HackathonDashboard"],
    }),

   
    getMajors: builder.query<any, void>({
      query: () => "/majors",
      providesTags: ["HackathonDashboard"],
    }),

    
    getChallenges: builder.query<any, void>({
      query: () => "/challenges",
      providesTags: ["HackathonDashboard"],
    }),

    
    getMentorshipNeededs: builder.query<any, void>({
      query: () => "/mentorship-neededs",
      providesTags: ["HackathonDashboard"],
    }),
  }),
});

export const {
  useGetHackathonInsightsQuery,
  useGetStudyLevelsQuery,
  useGetMajorsQuery,
  useGetChallengesQuery,
  useGetMentorshipNeededsQuery,
} = HackathonDashboardApi;

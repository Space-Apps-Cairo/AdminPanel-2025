import { api } from "../api";
import { EamilAudienceResponse } from "@/types/emails/audience";

export const emailAudienceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get audiences
    getEmailAudiences: builder.query<EamilAudienceResponse, void>({
      query: () => "/email-audience",
      providesTags: ["EmailAudiences"],
    }),
  }),
});

export const { useGetEmailAudiencesQuery } = emailAudienceApi;

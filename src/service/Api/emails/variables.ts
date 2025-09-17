import { EmailTemplateVariablesResponse } from "@/types/emails/variables";
import { api } from "../api";

export const emailVariableApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get variables for a specific template
    getEmailTemplateVariables: builder.query<
      EmailTemplateVariablesResponse,
      string
    >({
      query: (audience) => `/email-template-variables/${audience}`,
      providesTags: ["EmailVariables"],
    }),
  }),
});

export const { useGetEmailTemplateVariablesQuery } = emailVariableApi;

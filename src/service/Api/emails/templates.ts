import {
  EmailRequest,
  EmailTemplate,
  EmailTemplateRequest,
  EmailTemplateResponse,
  EmailTemplatesResponse,
  EmailTestRequest,
} from "@/types/emails/templates";
import { api } from "../api";

export const emailTemplateApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all email templates
    getEmailTemplates: builder.query<EmailTemplatesResponse, void>({
      query: () => "/email-template",
      providesTags: ["EmailTemplates"],
    }),

    getEmailTemplateById: builder.query<EmailTemplateResponse, string>({
      query: (id) => `/email-template-show/${id}`,
      providesTags: (result, error, id) => [{ type: "EmailTemplates", id }],
    }),

    // Add email template
    addEmailTemplate: builder.mutation<EmailTemplate, EmailTemplateRequest>({
      query: (newTemplate) => ({
        url: "/email-template-store",
        method: "POST",
        body: newTemplate,
      }),
      invalidatesTags: ["EmailTemplates"],
    }),

    // Update email template
    updateEmailTemplate: builder.mutation<
      EmailTemplate,
      { id: number; data: EmailTemplateRequest }
    >({
      query: ({ id, data }) => ({
        url: `/email-template-update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["EmailTemplates"],
    }),

    // Delete email template
    deleteEmailTemplate: builder.mutation<void, number>({
      query: (id) => ({
        url: `/email-template-delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["EmailTemplates"],
    }),

    sendEmails: builder.mutation<EmailTemplate, EmailRequest>({
      query: (data) => ({
        url: "/email-send",
        method: "POST",
        body: data,
      }),
    }),
    sendTestEmail: builder.mutation<EmailTemplate, EmailTestRequest>({
      query: (data) => ({
        url: "/send-test-mail",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetEmailTemplatesQuery,
  useGetEmailTemplateByIdQuery,
  useAddEmailTemplateMutation,
  useUpdateEmailTemplateMutation,
  useDeleteEmailTemplateMutation,
  useSendEmailsMutation,
  useSendTestEmailMutation,
} = emailTemplateApi;

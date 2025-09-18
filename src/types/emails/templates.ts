export type EmailTemplate = {
  id: number;
  title: string;
  subject: string;
  body: string;
  type: string;
  created_at: string;
};
export type EmailRequest = {
  template_id: number;
  ids: number[];
};
export type EmailTestRequest = {
  template_id: number;
  email: string;
};
export type EmailTemplatesResponse = { message: string; data: EmailTemplate[] };
export type EmailTemplateResponse = { message: string; data: EmailTemplate };
export type EmailTemplateRequest = Omit<EmailTemplate, "id" | "created_at">;

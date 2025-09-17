import z from "zod";

export const emailAudienceSchema = z.object({
  audience: z.string().min(1, { message: "Audience field is required" }),
});

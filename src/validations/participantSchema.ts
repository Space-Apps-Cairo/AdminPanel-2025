// import { z } from "zod";
// // RegEx & helpers
// const egyptPhoneRegex = /^01[0125][0-9]{8}$/; // صححت: 010|011|012|015
// const egyptNIDRegex = /^\d{14}$/; // رقم قومي 14 رقم
// const dateYMDRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD

// const fileLikeSchema = z.union([
//   typeof File !== "undefined" ? z.instanceof(File) : z.any(),

//   z
//     .object({ name: z.string(), size: z.number(), type: z.string() })
//     .passthrough(),
// ]);

// export const participantValidationSchema = z
//   .object({
//     name_ar: z.string().min(1, "Arabic name is required"),
//     name_en: z.string().min(1, "English name is required"),
//     email: z.string().email("Invalid email"),

//     phone_number: z
//       .string()
//       .regex(
//         egyptPhoneRegex,
//         "Invalid Egyptian phone number (e.g. 01012345678)"
//       ),

//     national_id: z.preprocess(
//       (v) => (v == null ? v : String(v).trim()),
//       z.string().regex(egyptNIDRegex, "National ID must be 14 digits")
//     ),

//     nationality: z.string().min(1, "Nationality is required"),

//     birth_date: z.preprocess(
//       (val) => (val instanceof Date ? val.toISOString().split("T")[0] : val),
//       z.string().regex(dateYMDRegex, "Birth date must be in YYYY-MM-DD format")
//     ),

//     age: z.preprocess(
//       (v) => (v === "" || v == null ? undefined : Number(v)),
//       z.number().int().min(0, "Age must be a positive number").optional()
//     ),

//     governorate: z.string().min(1, "Governorate is required"),
//     current_occupation: z.string().optional(),

//     educational_level_id: z.preprocess(
//       (v) => (v === "" || v == null ? v : Number(v)),
//       z.number().int().min(1, "Educational level is required")
//     ),

//     educational_institute: z
//       .string()
//       .min(1, "Educational institute is required"),

//     graduation_year: z.preprocess(
//       (v) => (v === "" || v == null ? undefined : Number(v)),
//       z
//         .number()
//         .int()
//         .min(1900, "Graduation year seems too old")
//         .max(new Date().getFullYear() + 10, "Graduation year seems too far")
//         .optional()
//     ),

//     field_of_study_id: z.preprocess(
//       (v) => (v === "" || v == null ? v : Number(v)),
//       z.number().int().min(1, "Field of study is required")
//     ),

//     skills: z.preprocess(
//       (val) => {
//         if (typeof val === "string") return [val];
//         if (Array.isArray(val)) return val;
//         return [];
//       },
//       z
//         .array(z.union([z.string(), z.number()]))
//         .transform((arr) => arr.map((v) => Number(v)))
//         .optional()
//     ),

//     is_have_team: z
//       .enum(["individual", "team_not_complete", "team_complete"], {
//         errorMap: () => ({
//           message:
//             "is_have_team must be one of: individual, team_not_complete, team_complete",
//         }),
//       })
//       .optional(),

//     participation_status: z
//       .enum(["ex_participant", "ex_volunteer", "first_time"])
//       .optional(),

//     participated_years: z.preprocess(
//       (v) => (v === "" || v == null ? undefined : Number(v)),
//       z.number().int().optional()
//     ),

//     attend_workshop: z.preprocess(
//       (v) => (v === "" || v == null ? undefined : Number(v)),
//       z
//         .number()
//         .int()
//         .refine((n) => n === 0 || n === 1, {
//           message: "Attend Workshop must be 0 or 1",
//         })
//         .optional()
//     ),

//     why_this_workshop: z.string().optional(),

//     year: z.preprocess(
//       (v) => (v === "" || v == null ? undefined : Number(v)),
//       z.number().int().optional()
//     ),

//     comment: z.string().optional(),

//     first_priority_id: z.preprocess(
//       (v) => (v == null || v === "" ? undefined : Number(v)),
//       z.number().int().min(1, "First priority workshop is required").optional()
//     ),
//     second_priority_id: z.preprocess(
//       (v) => (v == null || v === "" ? undefined : Number(v)),
//       z.number().int().min(1, "Second priority workshop is required").optional()
//     ),
//     third_priority_id: z.preprocess(
//       (v) => (v == null || v === "" ? undefined : Number(v)),
//       z.number().int().min(1, "Third priority workshop is required").optional()
//     ),
//     participant_status: z.enum(
//       ["ex_participant", "ex_volunteer", "first_time"],
//       {
//         required_error: "Participation status is required",
//       }
//     ),
//     national_id_front: z.preprocess(
//       (v) => (v == null ? undefined : v),
//       fileLikeSchema.optional()
//     ),
//     national_id_back: z.preprocess(
//       (v) => (v == null ? undefined : v),
//       fileLikeSchema.optional()
//     ),
//     personal_photo: z.preprocess(
//       (v) => (v == null ? undefined : v),
//       fileLikeSchema.optional()
//     ),
//   })
//   .refine(
//     (data) => {
//       if (!data.national_id || !data.birth_date) return true;

//       const nid = data.national_id;
//       const century = nid[0] === "2" ? "19" : "20";
//       const year = parseInt(century + nid.slice(1, 3));
//       const month = parseInt(nid.slice(3, 5));
//       const day = parseInt(nid.slice(5, 7));

//       const nidDate = new Date(year, month - 1, day); // الرقم القومي
//       const inputDate = new Date(data.birth_date);

//       return (
//         nidDate.getFullYear() === inputDate.getFullYear() &&
//         nidDate.getMonth() === inputDate.getMonth() &&
//         nidDate.getDate() === inputDate.getDate()
//       );
//     },
//     {
//       message:
//         "The national id birth date does not match the provided birth date.",
//       path: ["national_id"],
//     }
//   );

// export type ParticipantValidationInput = z.infer<
//   typeof participantValidationSchema
// >;
// export type ParticipantFormValues = z.infer<typeof participantValidationSchema>;


import { z } from "zod";

const egyptPhoneRegex = /^01[0125][0-9]{8}$/; // 010|011|012|015
const egyptNIDRegex = /^\d{14}$/; // رقم قومي 14 رقم
const dateYMDRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD

// File schema (يدعم File أو object شبه File أو string URL)
const fileLikeSchema = z.union([
  typeof File !== "undefined" ? z.instanceof(File) : z.any(),
  z.object({ name: z.string(), size: z.number(), type: z.string() }).passthrough(),
  z.string().url().optional(), // في حالة الـ API بيرجع URL
]);

export const participantValidationSchema = z
  .object({
    name_ar: z.string().min(1, "Arabic name is required"),
    name_en: z.string().min(1, "English name is required"),
    email: z.string().email("Invalid email"),

    phone_number: z
      .string()
      .regex(egyptPhoneRegex, "Invalid Egyptian phone number (e.g. 01012345678)"),

    national_id: z
      .string()
      .regex(egyptNIDRegex, "National ID must be 14 digits"),

    nationality: z.string().min(1, "Nationality is required"),

    birth_date: z
      .string()
      .regex(dateYMDRegex, "Birth date must be in YYYY-MM-DD format"),

    age: z
      .number()
      .int()
      .min(0, "Age must be a positive number")
      .optional(),

    governorate: z.string().min(1, "Governorate is required"),
    current_occupation: z.string().optional(),

    educational_level_id: z.coerce
      .number()
      .int()
      .min(1, "Educational level is required"),

    educational_institute: z.string().min(1, "Educational institute is required"),

    graduation_year: z.coerce
      .number()
      .int()
      .min(1900, "Graduation year seems too old")
      .max(new Date().getFullYear() + 10, "Graduation year seems too far")
      .optional(),

    field_of_study_id: z.coerce
      .number()
      .int()
      .min(1, "Field of study is required"),

    skills: z
      .array(z.union([z.string(), z.number()]))
      .transform((arr) => arr.map((v) => Number(v)))
      .optional(),

    is_have_team: z
  .enum(["individual", "team_not_complete", "team_complete"])
  .refine((val) => !!val, {
    message:
      "Team status must be one of: individual, team_not_complete, team_complete",
  }),
   participation_status: z
  .enum(["ex_participant", "ex_volunteer", "first_time"])
  .refine((val) => !!val, {
    message: "Participation status is required",
  }),

    participated_years: z.union([z.string(), z.array(z.string())]).optional(),

    attend_workshop: z.coerce
      .number()
      .int()
      .refine((n) => n === 0 || n === 1, {
        message: "Attend Workshop must be 0 or 1",
      })
      .optional(),

    why_this_workshop: z.string().optional(),
    year: z.coerce.number().int().optional(),
    comment: z.string().optional(),

    first_priority_id: z.coerce.number().int().optional(),
    second_priority_id: z.coerce.number().int().optional(),
    third_priority_id: z.coerce.number().int().optional(),

    national_id_front: fileLikeSchema.optional(),
    national_id_back: fileLikeSchema.optional(),
    personal_photo: fileLikeSchema.optional(),
  })
  .refine(
    (data) => {
      if (!data.national_id || !data.birth_date) return true;

      const nid = data.national_id;
      const century = nid[0] === "2" ? "19" : "20";
      const year = parseInt(century + nid.slice(1, 3));
      const month = parseInt(nid.slice(3, 5));
      const day = parseInt(nid.slice(5, 7));

      const nidDate = new Date(year, month - 1, day);
      const inputDate = new Date(data.birth_date);

      return (
        nidDate.getFullYear() === inputDate.getFullYear() &&
        nidDate.getMonth() === inputDate.getMonth() &&
        nidDate.getDate() === inputDate.getDate()
      );
    },
    {
      message: "The national id birth date does not match the provided birth date.",
      path: ["national_id"],
    }
  );

export type ParticipantValidationInput = z.infer<typeof participantValidationSchema>;
export type ParticipantFormValues = z.infer<typeof participantValidationSchema>;

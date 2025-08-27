import { api } from "./api";

export interface FieldOfStudy {
  id: number;
  name: string;
}

export const fieldsOfStudyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all fields of study
    getAllFieldsOfStudy: builder.query<{ data: FieldOfStudy[] }, void>({
      query: () => "/mention-your-fields",
      providesTags: ["FieldOfStudy"],
    }),

    // Get field of study by id
    getFieldOfStudyById: builder.query<{ data: FieldOfStudy }, number>({
      query: (id) => `/mention-your-fields/${id}`,
      providesTags: (_result, _error, id) => [{ type: "FieldOfStudy", id }],
    }),

    // Add new field of study
    addNewFieldOfStudy: builder.mutation<
      { data: FieldOfStudy },
      Partial<FieldOfStudy>
    >({
      query: (body) => ({
        url: "/mention-your-fields",
        method: "POST",
        body,
      }),
      invalidatesTags: ["FieldOfStudy"],
    }),

    // Update field of study
    updateFieldOfStudy: builder.mutation<
      { data: FieldOfStudy },
      { id: number; body: Partial<FieldOfStudy> }
    >({
      query: ({ id, body }) => ({
        url: `/mention-your-fields/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "FieldOfStudy", id },
        "FieldOfStudy",
      ],
    }),

    // Delete field of study
    deleteFieldOfStudy: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/mention-your-fields/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: "FieldOfStudy", id },
        "FieldOfStudy",
      ],
    }),
  }),
});

export const {
  useGetAllFieldsOfStudyQuery,
  useGetFieldOfStudyByIdQuery,
  useAddNewFieldOfStudyMutation,
  useUpdateFieldOfStudyMutation,
  useDeleteFieldOfStudyMutation,
} = fieldsOfStudyApi;

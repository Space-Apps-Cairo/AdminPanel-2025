import { api } from "./api";
import { Form, FormsResponse } from "@/types/forms";

export const formsApi = api.injectEndpoints({
    endpoints: (build) => ({
        getAllForms: build.query<FormsResponse, void>({
            query: () => "/forms",
            providesTags: ["Forms"],
        }),

        getFormById: build.query<Form, number>({
            query: (id) => `/forms/${id}`,
            providesTags: (_res, _err, id) => [{ type: "Forms", id }],
        }),

        createForm: build.mutation<Form, Omit<Form, "id">>({
            query: (body) => ({
                url: "/forms",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Forms"],
        }),

        updateForm: build.mutation<Form, Partial<Form> & { id: number }>({
            query: ({ id, ...body }) => ({
                url: `/forms/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (_res, _err, { id }) => [{ type: "Forms", id }],
        }),

        deleteForm: build.mutation<void, number>({
            query: (id) => ({
                url: `/forms/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Forms"],
        }),

        // Get Form Models 
        getFormModels: build.query<Form, void>({
            query: () => `/get-form-models`,
            providesTags: ["Forms"]
        }),
    }),
});

export const {
    useGetAllFormsQuery,
    useGetFormByIdQuery,
    useCreateFormMutation,
    useUpdateFormMutation,
    useDeleteFormMutation,
    useGetFormModelsQuery,
} = formsApi;

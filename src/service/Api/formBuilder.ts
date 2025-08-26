import { FormField, FormStep, FormStepResponse } from "@/types/formBuilder";
import { api } from "./api";


export const formBuilderApi = api.injectEndpoints({
    endpoints: (build) => ({
        getAllStepsById: build.query<FormStepResponse, void>({
            query: (id) => `/form-steps/${id}`,
            providesTags: ["FormBuilder"],
        }),

        addStep: build.mutation<FormStepResponse, FormStep>({
            query: (body) => ({
                url: "/form-step",
                method: "POST",
                body,
            }),
            invalidatesTags: ["FormBuilder"],
        }),

        updateStep: build.mutation<FormStepResponse, FormStep>({
            query: (body) => ({
                url: `/form-step/${body.id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["FormBuilder"],
        }),

        deleteStep: build.mutation<void, number>({
            query: (id) => ({
                url: `/form-step/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["FormBuilder"],
        }),

        // fields
        getAllFieldsById: build.query<FormStepResponse, void>({
            query: (id) => `/form-steps/${id}`,
            providesTags: ["FormBuilderFields"],
        }),

        addField: build.mutation<FormStepResponse, FormField>({
            query: (body) => ({
                url: "/form-fields",
                method: "POST",
                body,
            }),
            invalidatesTags: ["FormBuilderFields"],
        }),

        updateField: build.mutation<FormStepResponse, FormStep>({
            query: (body) => ({
                url: `/form-fields/${body.id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["FormBuilderFields"],
        }),

        deleteField: build.mutation<void, number>({
            query: (id) => ({
                url: `/form-fields/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["FormBuilderFields"],
        }),


    }),
});

export const {
    useGetAllStepsByIdQuery,
    useAddStepMutation,
    useUpdateStepMutation,
    useDeleteStepMutation,
    useGetAllFieldsByIdQuery,
    useAddFieldMutation,
    useUpdateFieldMutation,
    useDeleteFieldMutation,
} = formBuilderApi;

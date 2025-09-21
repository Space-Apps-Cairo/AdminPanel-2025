// src/service/Api/hackathon/memberRoles.ts

import { api } from "@/service/api";
import type { MemberRole, MemberRoleRequest } from "@/types/hackathon/memberRoles";

export const memberRolesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get list
    getMemberRoles: builder.query<MemberRole[], void>({
      query: () => ({
        url: "/member-roles",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((r) => ({ type: "MemberRole" as const, id: r.id })),
              { type: "MemberRole" as const, id: "LIST" },
            ]
          : [{ type: "MemberRole" as const, id: "LIST" }],
    }),

    // Show single
    getMemberRoleById: builder.query<MemberRole, number>({
      query: (id) => ({
        url: `/member-roles/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _err, id) => [{ type: "MemberRole", id }],
    }),

    // Create
    addMemberRole: builder.mutation<MemberRole, MemberRoleRequest>({
      query: (body) => ({
        url: "/member-roles",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "MemberRole", id: "LIST" }],
    }),

    // Update
    updateMemberRole: builder.mutation<
      MemberRole,
      { id: number; data: Partial<MemberRoleRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/member-roles/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (res, err, arg) => [
        { type: "MemberRole", id: arg.id },
        { type: "MemberRole", id: "LIST" },
      ],
    }),

    // Delete
    deleteMemberRole: builder.mutation<void, number>({
      query: (id) => ({
        url: `/member-roles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (res, err, id) => [
        { type: "MemberRole", id },
        { type: "MemberRole", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMemberRolesQuery,
  useGetMemberRoleByIdQuery,
  useAddMemberRoleMutation,
  useUpdateMemberRoleMutation,
  useDeleteMemberRoleMutation,
} = memberRolesApi;

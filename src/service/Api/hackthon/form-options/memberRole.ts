import { MemberRole, MemberRolesResponse } from "@/types/hackthon/form-options/memberRole";
import { api } from "../../api";

export const MemberRoleApi = api.injectEndpoints({
  endpoints: (build) => ({
    getMemberRoles: build.query<MemberRolesResponse, void>({
      query: () => "/member-roles",
      providesTags: ["MemberRoles"],
    }),

    
    getMemberRoleById: build.query<MemberRole, string | number>({
      query: (id) => `/member-roles/${id}`,
      providesTags: (result, error, id) => [{ type: "MemberRoles", id }],
    }),

    addMemberRole: build.mutation<MemberRole, Partial<MemberRole>>({
      query: (role) => ({
        url: "/member-roles",
        method: "POST",
        body: role,
      }),
      invalidatesTags: ["MemberRoles"],
    }),

    deleteMemberRole: build.mutation<void, string | number>({
      query: (id) => ({
        url: `/member-roles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MemberRoles"],
    }),

    updateMemberRole: build.mutation<
      MemberRole,
      { id: string | number; data: Partial<MemberRole> }
    >({
      query: ({ id, data }) => ({
        url: `/member-roles/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["MemberRoles"],
    }),
  }),
});

export const {
  useGetMemberRolesQuery,
  useGetMemberRoleByIdQuery,
  useAddMemberRoleMutation,
  useDeleteMemberRoleMutation,
  useUpdateMemberRoleMutation,
} = MemberRoleApi;

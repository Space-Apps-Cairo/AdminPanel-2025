// src/services/members.ts
import {
  Member,
  MemberRequest,
  MembersResponse,
  MemberResponse,
} from "@/types/hackthon/member";
import { api } from "../api";

export const membersApi = api.injectEndpoints({
  endpoints: (build) => ({
    // Get all members
    getMembers: build.query<Member[], void>({
      query: () => "/members",
      transformResponse: (response: MembersResponse) => response.data ?? [],
      providesTags: ["Member"],
    }),

    // Get single member by ID
    getMemberById: build.query<Member, number>({
      query: (id) => `/members/${id}`,
      transformResponse: (response: MemberResponse) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Member", id }],
    }),

    // Add member
    addMember: build.mutation<Member, MemberRequest>({
      query: (memberData) => ({
        url: "/members",
        method: "POST",
        body: memberData,
      }),
      invalidatesTags: ["Member"],
    }),

    // Update member
    updateMember: build.mutation<
      Member,
      { id: number; data: Partial<MemberRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/members/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Member", id }],
    }),

    // Delete member
    deleteMember: build.mutation<{ success: boolean; message: string }, number>(
      {
        query: (id) => ({
          url: `/members/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Member"],
      }
    ),
  }),
});

export const {
  useGetMembersQuery,
  useGetMemberByIdQuery,
  useAddMemberMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
} = membersApi;

import { Member, MembersResponse } from "@/types/hackthon/member";
import { api } from "../api";

export const HackathonAttend=api.injectEndpoints({
endpoints:(builder)=>({
    registerHackathonMember: builder.mutation<
  RegisterHackathonMemberResponse,
  RegisterHackathonMemberRequest
>({
  query: ({ member_id }) => ({
    url: `/member-attending/${member_id}`,
    method: "POST",
    body: {}, 
  }),
  invalidatesTags: ["HackathonAttend"], 
}),

//Hackthon Attendees
  getMembers: builder.query<Member[], void>({
       query: () => "/hackathon-attended-members",
       transformResponse: (response: MembersResponse) => response.data ?? [],
       providesTags: ["HackathonAttend"],
     }),
 //hackathon-pending-members
getpendingmembers: builder.query<Member[], void>({
       query: () => "/hackathon-pending-members",
       transformResponse: (response: MembersResponse) => response.data ?? [],
       providesTags: ["HackathonAttend"],
     }),
})
})
export const {useRegisterHackathonMemberMutation
  ,useGetMembersQuery
}=HackathonAttend;




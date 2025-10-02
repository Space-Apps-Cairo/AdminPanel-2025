import { Member, MembersResponse } from "@/types/hackthon/member";
import { api } from "../api";
import {
  RegisterHackathonMemberRequest,
  RegisterHackathonMemberResponse,
} from "@/types/hackthon/attending";

export const HackathonAttend = api.injectEndpoints({
  endpoints: (builder) => ({
    registerHackathonMember: builder.mutation<
      RegisterHackathonMemberResponse,
      RegisterHackathonMemberRequest
    >({
      query: ({ uuid }) => ({
        url: `/member-attending/${uuid}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["HackathonAttend"],
    }),

    registerHackathonVolunteer: builder.mutation<
      RegisterHackathonMemberResponse,
      RegisterHackathonMemberRequest
    >({
      query: ({ uuid }) => ({
        url: `/volunteers-attending/${uuid}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["HackathonAttend"],
    }),

    registerHackathonVip: builder.mutation<
      RegisterHackathonMemberResponse,
      RegisterHackathonMemberRequest
    >({
      query: ({ uuid }) => ({
        url: `/vip-attending/${uuid}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["HackathonAttend"],
    }),

    registerHackathonMentor: builder.mutation<
      RegisterHackathonMemberResponse,
      RegisterHackathonMemberRequest
    >({
      query: ({ uuid }) => ({
        url: `/mentor-attending/${uuid}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["HackathonAttend"],
    }),

    registerHackathonJudge: builder.mutation<
      RegisterHackathonMemberResponse,
      RegisterHackathonMemberRequest
    >({
      query: ({ uuid }) => ({
        url: `/judge-attending/${uuid}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["HackathonAttend"],
    }),

    registerHackathonGuest: builder.mutation<
      RegisterHackathonMemberResponse,
      RegisterHackathonMemberRequest
    >({
      query: ({ uuid }) => ({
        url: `/guest-attending/${uuid}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["HackathonAttend"],
    }),

    //Hackthon Attendees
    getAttendedMembers: builder.query<MembersResponse, string>({
      query: (queryString) => `/hackathon-attended-members${queryString}`,
      providesTags: ["HackathonAttend"],
    }),

    //hackathon-pending-members
    getpendingmembers: builder.query<Member[], void>({
      query: () => "/hackathon-pending-members",
      transformResponse: (response: MembersResponse) => response.data ?? [],
      providesTags: ["HackathonAttend"],
    }),
  }),
});
export const {
  useRegisterHackathonMemberMutation,
  useGetAttendedMembersQuery,
  useRegisterHackathonMentorMutation,
  useRegisterHackathonVipMutation,
  useRegisterHackathonJudgeMutation,
  useRegisterHackathonGuestMutation,
  useRegisterHackathonVolunteerMutation,
} = HackathonAttend;

// hackathonInsights.ts

// Define the structure of the hackathon insights data
export interface HackathonInsightsData {
  totalMembers: number;
  totalMembersMale: number;
  totalMembersFemale: number;
  attendeesMembersFirstDay: number;
  day1Male: number;
  day1Female: number;
  attendeesMembersSecondDay: number;
  day2Male: number;
  day2Female: number;
  day2Onsite: number;
  day2Virtual: number;
  attendeesMembers: number;
  attendeesJudges: number;
  attendeesMentors: number;
  attendeesGuests: number;
  attendeesVips: number;
  attendeesVolunteers: number;
}

// Define the full API response structure
export interface HackathonInsightsResponse {
  status: number;
  success: boolean;
  message: string;
  data: HackathonInsightsData;
}

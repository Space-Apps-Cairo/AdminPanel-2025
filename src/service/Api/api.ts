// src/service/api.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import cookieService from "../cookies/cookieService";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    // baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    baseUrl: "https://adminpanel.spaceappscairo.com/api/v1",
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      const token = cookieService.get("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  tagTypes: [
    "Login",
    "Workshop",
    "Bootcamps",
    "Preference",
    "Assignment",
    "Participant",
    "BootcampDashboard",
    "Forms",
    "Volunteers",
    "Materials",
    "Collections",
    "FieldOfStudy",
    "EducationalLevel",
    "Skill",
    "BootcampDetails",
    "CollectionUsers",
    "Nationalities",
    "TeamStatus",
    "ParticipationStatus",
    "EmailTemplates",
    "EmailVariables",
    "EmailAudiences",
    "Teams",
    "Challenges",
    "Major",
    "Member",
    "Tshirts",
    "StudyLevel",
    "MentorShipNeeded",
    "ParticipationMethod",
    "MemberRoles",
    "ActualSolutions",
  ],

  endpoints: () => ({}), // start empty
});

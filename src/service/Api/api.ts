import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import cookieService from "../cookies/cookieService";

export const api = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: "https://staging.spaceappscairo.com/api/v1",
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
    "FieldOfStudy", "EducationalLevel", "Skill"
  ],

  endpoints: () => ({}), // start empty
});

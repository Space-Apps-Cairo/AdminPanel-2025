// src/service/api.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://staging.spaceappscairo.com/api/v1",
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Participants", "Workshops", "Bootcamps", "MemberRole","ActualSolutions","MemberRoles"],
  endpoints: () => ({}),
});
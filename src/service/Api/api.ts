import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import cookieService from "../cookies/cookieService";

export const api = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      const token = cookieService.get("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      } else {
        headers.set("Authorization", `Bearer 13|HzqsLXgvzXelHQlLsI5d8RwdgOXLwmvDiJPhuBOze5b367ec`);
      }
      return headers;
    },
  }),

  tagTypes: ["Login", "Workshop"],

  endpoints: () => ({}), // start empty
});

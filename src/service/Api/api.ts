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
      } else {
        headers.set(
          "Authorization",
          `Bearer 13|HzqsLXgvzXelHQlLsI5d8RwdgOXLwmvDiJPhuBOze5b367ec`
        );
      }
      return headers;
    },
  }),

  tagTypes: ["Login", "Workshop"],

  endpoints: () => ({}), // start empty
});

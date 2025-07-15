import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import cookieService from "../cookies/cookieService";

export const api = createApi({

  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: `https://ecommerce.routemisr.com`,
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
  ],

  endpoints: () => ({}), // start empty
});

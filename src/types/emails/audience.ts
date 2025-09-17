export type EamilAudience = "particpants";

export type EamilAudienceResponse = {
  status: string;
  code: string;
  message: string;
  data: EamilAudience[];
};

import { EamilAudience } from "./audience";

export type EmailTemplateVariable = {
  key: string;
  label: string;
  source: string;
  type: string;
};

export type EmailTemplateVariablesResponse = {
  audience: EamilAudience;
  var_counts: number;
  variables: EmailTemplateVariable[];
};

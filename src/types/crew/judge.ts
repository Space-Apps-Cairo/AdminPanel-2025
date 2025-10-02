export type Judge ={

  name: string;
  expertise: string;
  title: string;
  uuid: string;
  jude_before_at: string;
  email: string;
  linkedIn?: string | null;
  phone?: string | null;
  judging_area: string;
  reached_out_by_call?: boolean;
  confirmed_status?: boolean;
  response_status?: 
    | "responded_via_call"
    | "responded_via_email_linkedin"
    | "did_not_respond"
    | "cancelled_via_email_linkedin"
    | "pending";
}

export interface JudgeRequest extends Omit<Judge, "uuid" > {} 

export type  JudgeResponse ={
  status: number;
  success: boolean;
  message: string;
  data: Judge[];
}

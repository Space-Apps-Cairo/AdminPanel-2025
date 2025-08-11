
// src/types/participants.ts

export interface ParticipantRequest {
  name: string;
  email: string;
  phone: string;
  gender: "male" | "female";
  status: "active" | "inactive";
}

export interface ParticipantResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: "male" | "female";
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}
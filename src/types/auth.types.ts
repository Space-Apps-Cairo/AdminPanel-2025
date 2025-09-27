export type UserRole =
  | "Admin"
  | "material"
  | "logistics"
  | "registeration"
  | "filtration";

export interface UserType {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  two_factor: number;
  two_factor_expires_at: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  role: UserRole;
}
export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: UserType;
}
export interface LoginRequest {
  email: string;
  password: string;
}

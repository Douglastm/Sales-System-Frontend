export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  active?: boolean;
  user?: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    active?: boolean;
  };
  token?: string;
  accessToken?: string;
  access_token?: string;
  refreshToken?: string;
  refresh_token?: string;
  [key: string]: unknown;
}

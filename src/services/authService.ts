import { api } from './api';
import type { LoginRequest, LoginResponse } from '../types/auth';

const SESSION_KEY = 'auth_session';
const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_EMAIL_KEY = 'auth_user_email';
const USER_ID_KEY = 'auth_user_id';
const LOGIN_PATH = import.meta.env.VITE_AUTH_LOGIN_PATH ?? '/v1/auth/login';

const extractToken = (response: LoginResponse): string | null => (
  typeof response.access_token === 'string' ? response.access_token
    : typeof response.accessToken === 'string' ? response.accessToken
      : typeof response.token === 'string' ? response.token
        : null
);

const extractRefreshToken = (response: LoginResponse): string | null => (
  typeof response.refresh_token === 'string' ? response.refresh_token
    : typeof response.refreshToken === 'string' ? response.refreshToken
      : null
);

const extractUserEmail = (response: LoginResponse, fallbackEmail: string): string | null => (
  typeof response.email === 'string' ? response.email
    : typeof response.user?.email === 'string' ? response.user.email
      : fallbackEmail || null
);

const extractUserId = (response: LoginResponse): string | null => (
  typeof response.id === 'string' ? response.id
    : typeof response.user?.id === 'string' ? response.user.id
      : null
);

class AuthService {
  isAuthenticated(): boolean {
    return localStorage.getItem(SESSION_KEY) === 'true';
  }

  getCurrentUserEmail(): string | null {
    return localStorage.getItem(USER_EMAIL_KEY);
  }

  getCurrentUserId(): string | null {
    return localStorage.getItem(USER_ID_KEY);
  }

  async login(payload: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(LOGIN_PATH, payload);
    const data = response.data ?? {};
    const token = extractToken(data);
    const refreshToken = extractRefreshToken(data);
    const userEmail = extractUserEmail(data, payload.email);
    const userId = extractUserId(data);

    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }

    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }

    localStorage.setItem(SESSION_KEY, 'true');

    if (userEmail) {
      localStorage.setItem(USER_EMAIL_KEY, userEmail);
    } else {
      localStorage.removeItem(USER_EMAIL_KEY);
    }

    if (userId) {
      localStorage.setItem(USER_ID_KEY, userId);
    } else {
      localStorage.removeItem(USER_ID_KEY);
    }

    return data;
  }

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_EMAIL_KEY);
    localStorage.removeItem(USER_ID_KEY);
  }
}

export default new AuthService();

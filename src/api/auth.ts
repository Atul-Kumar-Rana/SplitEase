// 
import { apiFetch } from './apiClient';

export interface User {
  id: number;
  name?: string;
  username?: string;
  email: string;
  total?: number;
  debitors?: any[];
  events?: any[];
}

export interface AuthResponse {
  token: string;
  user?: User; // optional, backend doesn't send this on login
}

export interface LoginRequest {
  email: string; // change to "username" if your backend expects that
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

// LOGIN – backend returns only token (either plain string or { token: "..." })
export async function login(data: LoginRequest): Promise<AuthResponse> {
  const res = await apiFetch<string | { token: string }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
    skipAuth: true,
  });

  const token =
    typeof res === 'string'
      ? res
      : (res as { token: string }).token;

  localStorage.setItem('token', token);

  return { token };
}

// SIGNUP – keep existing behaviour (works already)
export async function signup(data: SignupRequest): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
    skipAuth: true,
  });
}

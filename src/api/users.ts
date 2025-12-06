// import { apiFetch } from './apiClient';
// import type { User } from './auth';

// export type { User } from './auth';

// export interface CreateUserRequest {
//   username: string;
//   total?: number;
// }

// export interface UpdateUserRequest {
//   username?: string;
//   total?: number;
// }

// export async function getCurrentUser(): Promise<User> {
//   return apiFetch<User>('/api/users/me');
// }

// export async function createUser(data: CreateUserRequest): Promise<User> {
//   return apiFetch<User>('/api/users', {
//     method: 'POST',
//     body: JSON.stringify(data),
//   });
// }

// export async function listUsers(): Promise<User[]> {
//   return apiFetch<User[]>('/api/users');
// }

// export async function getUserById(id: number): Promise<User> {
//   return apiFetch<User>(`/api/users/${id}`);
// }

// export async function updateUser(id: number, data: UpdateUserRequest): Promise<User> {
//   return apiFetch<User>(`/api/users/${id}`, {
//     method: 'PUT',
//     body: JSON.stringify(data),
//   });
// }

// export async function deleteUser(id: number): Promise<void> {
//   return apiFetch<void>(`/api/users/${id}`, {
//     method: 'DELETE',
//   });
// }

// export async function getUserDebitors(userId: number): Promise<any[]> {
//   return apiFetch<any[]>(`/api/users/${userId}/debitors`);
// }

// export async function getUserTransactions(userId: number): Promise<any[]> {
//   return apiFetch<any[]>(`/api/users/${userId}/transactions`);
// }

import { apiFetch } from './apiClient';

/**
 * Minimal user shape from:
 *  GET /api/users
 *  GET /api/users/{id}
 *
 * Backend returns:
 *  { "id", "username", "total" }
 */
export interface MinimalUser {
  id: number;
  username: string;
  total: number;
  email?: string; // not returned in /api/users, kept optional for convenience
}

/**
 * Detailed current user from:
 *  GET /api/users/me
 *
 * Backend returns:
 *  {
 *    id, email, username, total, emailVerified,
 *    youOwe, owedToYou,
 *    debitors: [...],
 *    events: [...]
 *  }
 */
export interface MeDebitor {
  id: number;
  eventId: number | null;
  userId: number | null;
  debAmount: number;
  amountPaid: number;
  remaining: number;
  included: boolean;
  settled: boolean;
}

export interface MeEvent {
  id: number;
  title: string;
  total: number;
  cancelled: boolean;
}

export interface CurrentUser {
  id: number;
  email: string;
  username: string;
  total: number;
  emailVerified: boolean;
  youOwe: number;
  owedToYou: number;
  debitors: MeDebitor[];
  events: MeEvent[];
}

/** union type if any component just imports `User` */
export type User = MinimalUser | CurrentUser;

/**
 * GET /api/users  → list minimal users
 */
export const listUsers = () => apiFetch<MinimalUser[]>('/api/users');

/**
 * GET /api/users/me  → current authenticated user
 */
export const getCurrentUser = () => apiFetch<CurrentUser>('/api/users/me');

/**
 * GET /api/users/{id} → single minimal user (username + total)
 */
export const getUserById = (id: number) =>
  apiFetch<MinimalUser>(`/api/users/${id}`);

/**
 * PUT /api/users/{id}
 * Backend accepts partial User:
 *  { "username": "...", "total": 123.45, "password"?: "..." }
 * and returns:
 *  { "id", "username", "total" }
 */
export interface UpdateUserRequest {
  username?: string;
  total?: number;
  password?: string;
}

export interface UpdateUserResponse {
  id: number;
  username: string;
  total: number;
}

export const updateUser = (id: number, payload: UpdateUserRequest) =>
  apiFetch<UpdateUserResponse>(`/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

/**
 * DELETE /api/users/{id}
 */
export const deleteUser = (id: number) =>
  apiFetch<null>(`/api/users/${id}`, {
    method: 'DELETE',
  });

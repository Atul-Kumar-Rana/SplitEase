import { BASE_URL } from './base';

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { skipAuth = false, headers: customHeaders, ...restOptions } = options;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  if (!skipAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...restOptions,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}

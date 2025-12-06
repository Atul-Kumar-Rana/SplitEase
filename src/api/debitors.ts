import { apiFetch } from './apiClient';

export interface Debitor {
  id: number;
  userId: number;
  eventId: number;
  debAmount: number;
  amountPaid: number;
  included: boolean;
  settled: boolean;
}

export interface AddDebitorRequest {
  userId: number;
  included: boolean;
  debAmount?: number;
}

export interface UpdateDebitorRequest {
  amountPaid?: number;
  settled?: boolean;
  included?: boolean;
}

export async function addDebitorToEvent(eventId: number, data: AddDebitorRequest): Promise<Debitor> {
  return apiFetch<Debitor>(`/api/events/${eventId}/debitors`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateDebitor(debitorId: number, data: UpdateDebitorRequest): Promise<Debitor> {
  return apiFetch<Debitor>(`/api/debitors/${debitorId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

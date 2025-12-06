import { apiFetch } from './apiClient';

// DTO that matches EventController.CreateEventDto + ParticipantDto
export interface CreateEventParticipant {
  userId: number;
  included: boolean;
}

export interface CreateEventRequest {
  title: string;
  creatorId: number;
  total: number; // mapped to BigDecimal on backend
  participants: CreateEventParticipant[];
}

// This is the Event entity coming back from Spring
export interface EventSummary {
  id: number;
  title: string;
  total: number;
  cancelled: boolean;
  // there may be more fields (creator, splits, etc.) but we only need id for redirect
}

export const createEvent = (payload: CreateEventRequest) =>
  apiFetch<EventSummary>('/api/events', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const listEvents = () =>
  apiFetch<EventSummary[]>('/api/events');

// detailed view using your custom /api/events/{id} response
export interface EventSplit {
  id: number;
  debAmount: number;
  amountPaid: number;
  remaining: number;
  included: boolean;
  settled: boolean;
  paidAt: string | null;
  userId: number | null;
  username: string | null;
}

export interface EventDetail {
  id: number;
  title: string;
  total: number;
  cancelled: boolean;
  createdAt: string;
  creatorId: number | null;
  creatorUsername: string | null;
  splits: EventSplit[];
}

export const getEvent = (id: number | string) =>
  apiFetch<EventDetail>(`/api/events/${id}`);

export const cancelEvent = (id: number | string) =>
  apiFetch<EventSummary>(`/api/events/${id}/cancel`, {
    method: 'POST',
  });

export const deleteEvent = (id: number | string) =>
  apiFetch<null>(`/api/events/${id}`, {
    method: 'DELETE',
  });

// import { apiFetch } from './apiClient';

// export interface Participant {
//   userId: number;
//   included: boolean;
// }

// export interface Split {
//   id: number;
//   userId: number;
//   debAmount: number;
//   amountPaid: number;
//   included: boolean;
//   settled: boolean;
// }

// export interface Event {
//   id: number;
//   title: string;
//   creatorId: number;
//   total: number;
//   cancelled: boolean;
//   splits: Split[];
//   createdAt?: string;
// }

// export interface CreateEventRequest {
//   title: string;
//   creatorId: number;
//   total: number;
//   participants: Participant[];
// }

// export async function createEvent(data: CreateEventRequest): Promise<Event> {
//   return apiFetch<Event>('/api/events', {
//     method: 'POST',
//     body: JSON.stringify(data),
//   });
// }

// export async function listEvents(): Promise<Event[]> {
//   return apiFetch<Event[]>('/api/events');
// }

// export async function getEventById(id: number): Promise<Event> {
//   return apiFetch<Event>(`/api/events/${id}`);
// }

// export async function cancelEvent(id: number): Promise<Event> {
//   return apiFetch<Event>(`/api/events/${id}/cancel`, {
//     method: 'POST',
//   });
// }

// export async function deleteEvent(id: number): Promise<void> {
//   return apiFetch<void>(`/api/events/${id}`, {
//     method: 'DELETE',
//   });
// }

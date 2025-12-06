// import { apiFetch } from './apiClient';

// export interface Transaction {
//   id: number;
//   ts: string;
//   fromUser: number;
//   toUser: number;
//   amount: number;
//   eventId: number;
//   note?: string;
// }

// export interface PaymentRequest {
//   debitorId: number;
//   payerUserId: number;
//   amount: number;
// }

// export async function recordPayment(data: PaymentRequest): Promise<Transaction> {
//   return apiFetch<Transaction>('/api/payments/pay', {
//     method: 'POST',
//     body: JSON.stringify(data),
//   });
// }

// export async function listTransactions(): Promise<Transaction[]> {
//   return apiFetch<Transaction[]>('/api/transactions');
// }

import { apiFetch } from './apiClient';

// Returned from backend PaymentController
export interface Transaction {
  id: number;
  amount: number;
  debitorId?: number;
  payerUserId?: number;
  eventId?: number;
  ts?: string;
  note?: string;
}

export interface PaymentRequest {
  debitorId: number;
  payerUserId: number;
  amount: number;
}

export const payDebitor = (data: PaymentRequest) =>
  apiFetch<Transaction>('/api/payments/pay', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const listTransactions = () =>
  apiFetch<Transaction[]>('/api/transactions');

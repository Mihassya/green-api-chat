import type { Credentials, ReceivedNotification } from '../types';

// Документация: https://green-api.com/v3/docs/api/

export class GreenApiError extends Error {}

// {apiUrl}/waInstance{idInstance}/{method}/{apiTokenInstance}
function buildUrl({ apiUrl, idInstance, apiTokenInstance }: Credentials, method: string, suffix = '') {
  return `${apiUrl}/waInstance${idInstance}/${method}/${apiTokenInstance}${suffix}`;
}

async function request<T>(url: string, init?: RequestInit): Promise<T | null> {
  let res: Response;
  try {
    res = await fetch(url, init);
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') throw e;
    throw new GreenApiError('Нет соединения с GREEN-API');
  }

  if (res.status === 401 || res.status === 403) {
    throw new GreenApiError('Неверные idInstance или apiTokenInstance');
  }
  if (!res.ok) {
    throw new GreenApiError(`Ошибка GREEN-API (${res.status})`);
  }

  // receiveNotification при пустой очереди отдаёт пустое тело или null
  const text = await res.text();
  if (!text || text === 'null') return null;
  return JSON.parse(text) as T;
}

// 7 999 123-45-67 -> 79991234567@c.us
export function phoneToChatId(phone: string) {
  return `${phone.replace(/\D/g, '')}@c.us`;
}

export async function sendMessage(credentials: Credentials, chatId: string, message: string) {
  const data = await request<{ idMessage: string }>(buildUrl(credentials, 'sendMessage'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId, message }),
  });
  if (!data) throw new GreenApiError('Пустой ответ на sendMessage');
  return data;
}

export function receiveNotification(credentials: Credentials, signal?: AbortSignal, receiveTimeout = 20) {
  const url = buildUrl(credentials, 'receiveNotification', `?receiveTimeout=${receiveTimeout}`);
  return request<ReceivedNotification>(url, { signal });
}

export function deleteNotification(credentials: Credentials, receiptId: number, signal?: AbortSignal) {
  const url = buildUrl(credentials, 'deleteNotification', `/${receiptId}`);
  return request<{ result: boolean }>(url, { method: 'DELETE', signal });
}

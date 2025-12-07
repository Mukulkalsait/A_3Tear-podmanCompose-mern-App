import type { Contact, ContactPayload } from './types';

const resolveDefaultApiBase = () => {
  if (typeof window === 'undefined') {
    return 'http://localhost:4000';
  }
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = import.meta.env.VITE_BACKEND_PORT ?? '4000';
  return `${protocol}//${hostname}:${port}`;
};

const API_BASE = import.meta.env.VITE_API_URL ?? resolveDefaultApiBase();
const CONTACTS_ENDPOINT = `${API_BASE}/api/contacts`;

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const error = (payload as { error?: string }).error ?? 'Request failed';
    throw new Error(error);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
};

export const api = {
  listContacts: () => fetch(CONTACTS_ENDPOINT).then((res) => handleResponse<Contact[]>(res)),
  createContact: (data: ContactPayload) =>
    fetch(CONTACTS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((res) => handleResponse<Contact>(res)),
  updateContact: (id: string, data: ContactPayload) =>
    fetch(`${CONTACTS_ENDPOINT}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((res) => handleResponse<Contact>(res)),
  deleteContact: (id: string) =>
    fetch(`${CONTACTS_ENDPOINT}/${id}`, { method: 'DELETE' }).then((res) => handleResponse<void>(res)),
};


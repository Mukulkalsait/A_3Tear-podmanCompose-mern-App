export interface Contact {
  id: string;
  name: string;
  phone: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ContactPayload = Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>;




export interface Contact {
  id: string;
  name: string;
  phone: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ContactInput = Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>;




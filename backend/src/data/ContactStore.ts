import { promises as fs } from 'fs';
import { randomUUID } from 'crypto';
import path from 'path';
import { Contact, ContactInput } from '../types/contact';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'contacts.json');

export class ContactStore {
  private contacts: Contact[] = [];
  private initialized = false;

  private async ensureInitialized() {
    if (this.initialized) return;
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      const raw = await fs.readFile(DATA_FILE, 'utf-8');
      this.contacts = JSON.parse(raw) as Contact[];
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        await fs.writeFile(DATA_FILE, '[]', 'utf-8');
        this.contacts = [];
      } else {
        throw err;
      }
    }
    this.initialized = true;
  }

  private async persist() {
    await fs.writeFile(DATA_FILE, JSON.stringify(this.contacts, null, 2));
  }

  async all(): Promise<Contact[]> {
    await this.ensureInitialized();
    return this.contacts;
  }

  async create(input: ContactInput): Promise<Contact> {
    await this.ensureInitialized();
    const now = new Date().toISOString();
    const contact: Contact = {
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      ...input,
    };
    this.contacts = [contact, ...this.contacts];
    await this.persist();
    return contact;
  }

  async update(id: string, input: ContactInput): Promise<Contact | undefined> {
    await this.ensureInitialized();
    const idx = this.contacts.findIndex((c) => c.id === id);
    if (idx === -1) return undefined;
    const updated: Contact = {
      ...this.contacts[idx],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    this.contacts[idx] = updated;
    await this.persist();
    return updated;
  }

  async remove(id: string): Promise<boolean> {
    await this.ensureInitialized();
    const originalLength = this.contacts.length;
    this.contacts = this.contacts.filter((c) => c.id !== id);
    if (this.contacts.length === originalLength) {
      return false;
    }
    await this.persist();
    return true;
  }
}


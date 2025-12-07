"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactStore = void 0;
const fs_1 = require("fs");
const crypto_1 = require("crypto");
const path_1 = __importDefault(require("path"));
const DATA_DIR = path_1.default.resolve(process.cwd(), 'data');
const DATA_FILE = path_1.default.join(DATA_DIR, 'contacts.json');
class ContactStore {
    constructor() {
        this.contacts = [];
        this.initialized = false;
    }
    async ensureInitialized() {
        if (this.initialized)
            return;
        await fs_1.promises.mkdir(DATA_DIR, { recursive: true });
        try {
            const raw = await fs_1.promises.readFile(DATA_FILE, 'utf-8');
            this.contacts = JSON.parse(raw);
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                await fs_1.promises.writeFile(DATA_FILE, '[]', 'utf-8');
                this.contacts = [];
            }
            else {
                throw err;
            }
        }
        this.initialized = true;
    }
    async persist() {
        await fs_1.promises.writeFile(DATA_FILE, JSON.stringify(this.contacts, null, 2));
    }
    async all() {
        await this.ensureInitialized();
        return this.contacts;
    }
    async create(input) {
        await this.ensureInitialized();
        const now = new Date().toISOString();
        const contact = {
            id: (0, crypto_1.randomUUID)(),
            createdAt: now,
            updatedAt: now,
            ...input,
        };
        this.contacts = [contact, ...this.contacts];
        await this.persist();
        return contact;
    }
    async update(id, input) {
        await this.ensureInitialized();
        const idx = this.contacts.findIndex((c) => c.id === id);
        if (idx === -1)
            return undefined;
        const updated = {
            ...this.contacts[idx],
            ...input,
            updatedAt: new Date().toISOString(),
        };
        this.contacts[idx] = updated;
        await this.persist();
        return updated;
    }
    async remove(id) {
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
exports.ContactStore = ContactStore;

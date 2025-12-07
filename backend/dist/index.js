"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const ContactStore_1 = require("./data/ContactStore");
const app = (0, express_1.default)();
const store = new ContactStore_1.ContactStore();
const PORT = process.env.PORT ?? 4000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const validateContactPayload = (body) => {
    if (!body.name || !body.name.trim()) {
        return 'Name is required';
    }
    if (!body.phone || !/^[0-9+\-\s]+$/.test(body.phone)) {
        return 'Phone number is required (digits, plus, dash, spaces only)';
    }
    return null;
};
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
app.get('/api/contacts', async (_req, res) => {
    const contacts = await store.all();
    res.json(contacts);
});
app.post('/api/contacts', async (req, res) => {
    const error = validateContactPayload(req.body);
    if (error) {
        res.status(400).json({ error });
        return;
    }
    const payload = {
        name: req.body.name.trim(),
        phone: req.body.phone.trim(),
        notes: req.body.notes?.trim() || undefined,
    };
    const contact = await store.create(payload);
    res.status(201).json(contact);
});
app.put('/api/contacts/:id', async (req, res) => {
    const { id } = req.params;
    const error = validateContactPayload(req.body);
    if (error) {
        res.status(400).json({ error });
        return;
    }
    const payload = {
        name: req.body.name.trim(),
        phone: req.body.phone.trim(),
        notes: req.body.notes?.trim() || undefined,
    };
    const updated = await store.update(id, payload);
    if (!updated) {
        res.status(404).json({ error: 'Contact not found' });
        return;
    }
    res.json(updated);
});
app.delete('/api/contacts/:id', async (req, res) => {
    const success = await store.remove(req.params.id);
    if (!success) {
        res.status(404).json({ error: 'Contact not found' });
        return;
    }
    res.status(204).send();
});
app.listen(PORT, () => {
    console.log(`Temporary Contacts API running on http://localhost:${PORT}`);
});

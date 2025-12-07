import express, { Request, Response } from "express";
import cors from "cors";
import { ContactInput } from "./types/contact";
import { ContactStore } from "./data/ContactStore";

const app = express();
const store = new ContactStore();
const PORT = process.env.PORT ?? 4000;

app.use(cors());
app.use(express.json());

const validateContactPayload = (body: Partial<ContactInput>) => {
	if (!body.name || !body.name.trim()) {
		return "Name is required";
	}
	if (!body.phone || !/^[0-9+\-\s]+$/.test(body.phone)) {
		return "Phone number is required (digits, plus, dash, spaces only)";
	}
	return null;
};

app.get("/health", (_req, res) => {
	res.json({ status: "ok" });
});

app.get("/api/contacts", async (_req, res) => {
	const contacts = await store.all();
	res.json(contacts);
});

app.post("/api/contacts", async (req: Request, res: Response) => {
	const error = validateContactPayload(req.body);
	if (error) {
		res.status(400).json({ error });
		return;
	}
	const payload: ContactInput = {
		name: req.body.name.trim(),
		phone: req.body.phone.trim(),
		notes: req.body.notes?.trim() || undefined,
	};
	const contact = await store.create(payload);
	res.status(201).json(contact);
});

app.put("/api/contacts/:id", async (req: Request, res: Response) => {
	const { id } = req.params;
	const error = validateContactPayload(req.body);
	if (error) {
		res.status(400).json({ error });
		return;
	}
	const payload: ContactInput = {
		name: req.body.name.trim(),
		phone: req.body.phone.trim(),
		notes: req.body.notes?.trim() || undefined,
	};
	const updated = await store.update(id, payload);
	if (!updated) {
		res.status(404).json({ error: "Contact not found" });
		return;
	}
	res.json(updated);
});

app.delete("/api/contacts/:id", async (req: Request, res: Response) => {
	const success = await store.remove(req.params.id);
	if (!success) {
		res.status(404).json({ error: "Contact not found" });
		return;
	}
	res.status(204).send();
});

// app.listen(PORT, () => {
//   console.log(`Temporary Contacts API running on http://localhost:${PORT}`);
// });

app.listen(PORT, "0.0.0.0", () => {
	console.log(`Temporary Contacts API running on http://0.0.0.0:${PORT}`);
});


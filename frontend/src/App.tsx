import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import './App.css';
import { api } from './api';
import type { Contact, ContactPayload } from './types';

const emptyForm: ContactPayload = {
  name: '',
  phone: '',
  notes: '',
};

function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [form, setForm] = useState<ContactPayload>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const refreshContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listContacts();
      setContacts(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshContacts();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    const payload: ContactPayload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      notes: form.notes?.trim() || undefined,
    };
    try {
      if (editingId) {
        await api.updateContact(editingId, payload);
        setSuccessMessage('Contact updated');
      } else {
        await api.createContact(payload);
        setSuccessMessage('Contact added');
      }
      resetForm();
      await refreshContacts();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (contact: Contact) => {
    setEditingId(contact.id);
    setForm({
      name: contact.name,
      phone: contact.phone,
      notes: contact.notes ?? '',
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this contact?')) return;
    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await api.deleteContact(id);
      setSuccessMessage('Contact removed');
      await refreshContacts();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const normalizedPhone = (phone: string) => phone.replace(/\s+/g, '');
  const whatsappPhone = (phone: string) => phone.replace(/[^\d]/g, '');

  return (
    <div className="app-shell">
      <header>
        <div>
          <p className="eyebrow">Temporary Contacts</p>
          <h1>Keep short-term contacts tidy</h1>
          <p className="subtitle">
            Add, update, and reach out without mixing temporary numbers into your primary phonebook.
          </p>
        </div>
      </header>

      <main>
        <section className="card form-card">
          <h2>{editingId ? 'Update contact' : 'Add new contact'}</h2>
          {error && <p className="banner error">{error}</p>}
          {successMessage && <p className="banner success">{successMessage}</p>}
          <form onSubmit={handleSubmit}>
            <label>
              Name
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Delivery agent"
                required
              />
            </label>
            <label>
              Phone number
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+1 555 123 4567"
                required
              />
            </label>
            <label>
              Notes <span className="muted">(optional)</span>
              <textarea
                value={form.notes ?? ''}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Package ID, shift, or other quick context"
                rows={3}
              />
            </label>
            <div className="form-actions">
              <button type="submit" disabled={submitting}>
                {editingId ? 'Save changes' : 'Add contact'}
              </button>
              {editingId && (
                <button type="button" className="ghost" onClick={resetForm} disabled={submitting}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="card list-card">
          <div className="list-header">
            <h2>Contact list</h2>
            <button className="ghost" onClick={refreshContacts} disabled={loading}>
              Refresh
            </button>
          </div>
          {loading ? (
            <p>Loading…</p>
          ) : contacts.length === 0 ? (
            <p className="empty-state">
              No contacts yet. Add your first temporary contact using the form above.
            </p>
          ) : (
            <ul className="contact-list">
              {contacts.map((contact) => {
                const telHref = `tel:${normalizedPhone(contact.phone)}`;
                const whatsappDigits = whatsappPhone(contact.phone);
                const whatsappHref = whatsappDigits ? `https://wa.me/${whatsappDigits}` : undefined;
                return (
                  <li key={contact.id} className="contact-row">
                    <div>
                      <p className="contact-name">{contact.name}</p>
                      <p className="contact-meta">{contact.phone}</p>
                      {contact.notes && <p className="contact-notes">{contact.notes}</p>}
                    </div>
                    <div className="contact-actions">
                      <a className="ghost" href={telHref}>
                        Call
                      </a>
                      {whatsappHref && (
                        <a className="ghost" href={whatsappHref} target="_blank" rel="noreferrer">
                          WhatsApp
                        </a>
                      )}
                      <button onClick={() => handleEdit(contact)}>Edit</button>
                      <button className="danger" onClick={() => handleDelete(contact.id)}>
                        Delete
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;

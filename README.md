# Temporary Contacts: Shared Home Contact Saver

[![Podman Compose](https://img.shields.io/badge/Podman-Compose-blue?logo=podman&logoColor=white)](https://podman.io/) [![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js&logoColor=white)](https://nodejs.org/) [![React](https://img.shields.io/badge/React-TypeScript-blue?logo=react&logoColor=white)](https://react.dev/)

**Temporary Contacts** is a lightweight, containerized 2-tier app (Node.js/Express backend + React frontend) designed for shared household use. Imagine a central "contact book" on your home network: Save quick details for everyday services like your grocery shop, family doctor, barber, AC repair guy, or distant relatives—without cluttering personal phones. Anyone in the household can add, edit, or view contacts via a simple web dashboard. 

Key features:
- **One-click actions**: Open WhatsApp chats (`wa.me/<number>`) or dial calls (`tel:<number>`) directly from the browser—works on phones, laptops, or tablets.
- **Persistent & shared**: Contacts saved in a simple JSON file, accessible to all users on your Wi-Fi/LAN.
- **Zero hassle setup**: Run with one command using Podman-Compose. No database needed; scales easily for home servers or routers.
- **Privacy-first**: Local-only storage; no cloud sync or external dependencies.

Perfect for families, roommates, or small teams who want a communal "service directory" that's always a tab away. Built with TypeScript for reliability, and fully containerized for portable deploys.

## 🚀 Quick Start: Run with Podman Compose (LAN-Ready)

Get it live in under 5 minutes—no manual installs required. This spins up both backend and frontend in isolated containers, with data persistence via bind mounts.

### Prerequisites
- Podman (with Compose support) installed.
- Node.js 18+ (for local dev; containers handle runtime).

### One-Command Launch
```bash
git clone https://github.com/yourusername/A_3Tear-podmanCompose-mern-App.git
cd A_3Tear-podmanCompose-mern-App/lazycontact  # Or wherever your project root is
podman-compose up --build
```

- **Backend API**: Runs on `http://localhost:4000` (handles CRUD for contacts).
- **Frontend Dashboard**: Accessible at `http://localhost:5173` (React UI with add/edit/view + action buttons).

Stop with `Ctrl+C` or `podman-compose down`. Data persists in `./backend/data/contacts.json`.

### Share on Your Home Network (Wi-Fi/Router)
1. Keep `podman-compose up` running.
2. Find your machine's LAN IP: `hostname -I` or `ip addr show wlan0` (e.g., `192.168.1.100`).
3. From any device on the same network: Open `http://<your-lan-ip>:5173`.
   - The frontend auto-proxies API calls to the backend—no port forwarding needed.
4. Open firewall ports (if required):  
   On Linux (e.g., NixOS/Fedora):  
   ```bash
   sudo firewall-cmd --add-port=4000/tcp --add-port=5173/tcp --permanent
   sudo firewall-cmd --reload
   ```
   Adjust for your OS (e.g., `ufw allow 5173` on Ubuntu).

For production/home-server vibes, add a reverse proxy like Caddy or Traefik in another container for HTTPS/domain support.

![Dashboard Screenshot](screenshots/dashboard.png)  
*Main dashboard: Add contacts with name, number, notes. One-click WhatsApp/Call buttons light up on hover.*

![Add Contact Modal](screenshots/add-contact.png)  
*Quick add form—save and share instantly across devices.*

![LAN Access Demo Video](videos/lan-share.mp4)  
*(Short video: Launch on host, access from phone on Wi-Fi—seamless!)*

## 📁 Project Layout
```
lazycontact/
├── backend/          # Express + TypeScript API (JSON persistence for contacts)
│   ├── data/         # contacts.json (auto-created on first save)
│   ├── src/          # API routes, models, utils
│   └── podman-compose.yml  # Orchestrates both services
└── frontend/         # React (Vite) dashboard in TypeScript
    ├── src/          # Components: ContactList, ContactForm, ActionButtons
    └── public/       # Static assets
```

## 🛠️ Backend Details
The API is a simple Express server with TypeScript—no DB bloat. It stores contacts in `./backend/data/contacts.json` for easy backup/export.

### Local Dev (Without Containers)
```bash
cd backend
npm install
npm run dev  # Hot-reload on http://localhost:4000
# Or production build:
npm run build && npm start
```

**Endpoints**:
- `GET /api/contacts` — List all contacts.
- `POST /api/contacts` — Add new (body: `{ name, number, notes }`).
- `PUT /api/contacts/:id` — Update existing.
- `DELETE /api/contacts/:id` — Remove.

Test with curl/Postman:  
```bash
curl -X POST http://localhost:4000/api/contacts -H "Content-Type: application/json" -d '{"name":"Grocery Shop","number":"+91-1234567890","notes":"Daily essentials"}'
```

## 🎨 Frontend Details
Vite-powered React app with a clean, mobile-friendly UI. Fetches/saves via the backend API (proxied automatically in dev).

### Local Dev (Without Containers)
```bash
cd frontend
npm install
npm run dev  # http://localhost:5173
```

Env setup (optional `.env`):  
```
VITE_API_URL=http://localhost:4000
```

**Features**:
- Responsive list view with search/filter.
- Edit/Delete inline.
- Action buttons: WhatsApp opens in-app browser; Call triggers device dialer.

![WhatsApp/Call in Action](screenshots/action-buttons.png)  
*Hover a contact: Instant links to chat or call—cross-device magic.*

## 🔧 Development Tips
- **Start Order**: Backend first (for API availability), then frontend. Podman-Compose handles sequencing.
- **Data Swap**: JSON is simple; migrate to MongoDB by updating backend models—UI stays the same.
- **Customization**: Tweak `podman-compose.yml` for ports/volumes. Add auth (e.g., JWT) for multi-user access.
- **Troubleshooting**: Logs via `podman logs <container>`. Ensure UID/GID match for volume writes (auto-handled in compose).
- **Extend It**: Add QR code for easy LAN sharing, or integrate email/SMS reminders.

## 📸 Media Gallery
- **[Full Demo Video](media/videos/)**: End-to-end walkthrough—add contact, share on LAN, one-click actions.
- **[Architecture Diagram](media/imagees/)**: Backend → JSON → Frontend flow, with Podman network.

## 🤝 Contributing & License
Fork, PRs welcome! Issues for bugs/features. MIT License—use freely for your home setups.

**Built with ❤️ for hassle-free home tech. Star if it saves your next service call!** 🌟

---

*Deployed example: [Live on my LAN](http://192.168.1.x:5173) (yours will vary).*  
Questions? Open an issue or ping me.

# A_3Tear-podmanCompose-mern-App

Containerized MERN Contact Saver App with Podman-Compose name:-Temporary Contacts

## Temporary Contacts

A lightweight MERN-style demo for managing short-term contacts without touching your device address book. The app offers a TypeScript Express API with simple JSON storage and a React dashboard with quick Call/WhatsApp actions.

### Project layout

```
lazycontact/
├── backend/   # Express + TypeScript API, JSON file persistence
└── frontend/  # React (Vite) dashboard written in TypeScript
```

### Prerequisites

- Node.js 18+ (available on this NixOS host)
- npm (bundled with Node)

### Backend

```bash
cd /home/user/../lazycontact/backend
npm install          # already run, but safe to repeat
npm run dev          # start API with ts-node-dev on http://localhost:4000
# or build & run:
npm run build
npm start
```

The API writes contact data to `backend/data/contacts.json`. No external database is required.

Available endpoints:
- `GET /api/contacts`
- `POST /api/contacts`
- `PUT /api/contacts/:id`
- `DELETE /api/contacts/:id`

### Frontend

```bash
cd /home/user/../lazycontact/backend
npm install          # already run, but safe to repeat
npm run dev          # launches Vite dev server on http://localhost:5173
```

The UI calls the backend via `VITE_API_URL` (defaults to `http://localhost:4000`). Create a `.env` file if you need to override it:

```
VITE_API_URL=http://localhost:4000
```

### Run with Podman Compose (LAN friendly)

1. Build and start both containers:
   ```bash
   cd /home/user/../lazycontact/backend
   podman-compose up --build
   ```
   - Backend: `http://localhost:4000`
   - Frontend: `http://localhost:5173` (served via `serve` inside the frontend container)

2. Persisted contact data lives in `backend/data` thanks to the bind mount declared in `podman-compose.yml`.

3. To stop everything, press `Ctrl+C` or run `podman-compose down`.

### Broadcasting on your Wi-Fi / LAN

- Keep `podman-compose up` running, then determine your machine’s LAN IP (e.g. `hostname -I` or `ip addr show wlan0`).
- From any device on the same Wi-Fi, open `http://<your-lan-ip>:5173`. The frontend automatically proxies API calls to the backend service inside the compose network, so no extra configuration is needed.
- Make sure the host firewall allows inbound traffic on the exposed ports (`4000` and `5173`). On NixOS you can temporarily allow them with `sudo firewall-cmd --add-port=4000/tcp --add-port=5173/tcp --permanent && sudo firewall-cmd --reload` (adjust if you use a different firewall tool).
- If you need HTTPS or a custom domain later, place a reverse proxy (Caddy, Traefik, etc.) in front of these containers and expose that proxy on your network.

### Development tips

- Start the backend first so the frontend can reach the API (or rely on Vite’s proxy for local dev).
- Call and WhatsApp buttons use `tel:` links and `https://wa.me/<number>` respectively, so they work across devices without native integrations.
- Data currently lives in a JSON file; you can swap in MongoDB later without reshaping the UI.


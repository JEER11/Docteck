## Production deployment checklist

Use this list to prepare a safe launch.

1) Frontend env (.env.production)

Copy `.env.production.sample` to `.env.production` and set real values:

- PUBLIC_URL (e.g., `/app/`)
- REACT_APP_API_URL (Node API base)
- Firebase config (web)
- REACT_APP_STRIPE_PUBLISHABLE_KEY (live)
- GENERATE_SOURCEMAP=false

2) Backend and routing

- Serve via Nginx with HTTPS (see `nginx/nginx.conf`), enable gzip and security headers.
- Configure CORS on the Node/Flask backends to your production origins.
- Stripe: set live keys on backend and configure webhooks to your domain.

Express (Node) CORS example:

```js
import cors from 'cors';
const app = express();
const ORIGINS = [
   'https://yourdomain.com',
   'https://www.yourdomain.com',
];
app.use(cors({ origin: ORIGINS, credentials: true, methods: 'GET,POST,PATCH,PUT,DELETE,OPTIONS' }));
app.options('*', cors());
```

Flask CORS example:

```python
from flask_cors import CORS
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["https://yourdomain.com", "https://www.yourdomain.com"], "supports_credentials": True}})
```

Stripe webhook notes:

- Use your live secret key on the server only.
- Expose a public HTTPS endpoint (e.g., `/api/stripe/webhook`).
- Verify signatures with the webhook signing secret from Stripe dashboard.
- Test with `stripe trigger` or by creating real test events in live mode before launch day.

3) SPA fallback

- If serving static build from Nginx, enable `try_files ... /app/index.html;` under `/app/` location.
- If Flask serves the SPA, ensure its route returns `index.html` for unknown paths under `/app/*`.

4) Security

- Verify Firebase Firestore/Storage rules restrict access to authenticated users as intended.
- Keep secrets server-side; never ship private keys to the client.
- Review the CSP (currently Report-Only) and tighten it after auditing allowed hosts.
   - Typical allowances: Firebase domains, your API, Stripe (`https://js.stripe.com`, `https://*.stripe.com`), Google fonts if used.
   - After validating, switch to `Content-Security-Policy` (enforce) instead of Report-Only.

### Enable HTTPS + HSTS (Nginx)

Steps to serve over HTTPS with HSTS in Docker:

1) Get certificates
- Use Let’s Encrypt or your CA to obtain `fullchain.pem` and `privkey.pem`.
- Put them in `./certs/` (mounted read-only to `/etc/nginx/certs/`).

2) Expose 443 and mount certs in docker-compose
- In `docker-compose.yml` → `services.nginx`:
   - Uncomment `- "443:443"` under `ports`.
   - Uncomment `- ./certs:/etc/nginx/certs:ro` under `volumes`.

3) Enable the TLS server block
- Open `nginx/conf.d/ssl.conf`.
- Replace `server_name` with your real domain(s).
- Uncomment the `listen 443 ssl http2;` server block (and the optional `listen 80` redirect block).
- Keep the provided security headers and HSTS enabled once HTTPS is confirmed.

4) Deploy and test
- Bring the stack up and verify:
   - `https://yourdomain.com` loads and redirects HTTP→HTTPS if configured.
   - Response headers include HSTS and your CSP (Report-Only or enforced).
- After a short validation period, you can switch from Report-Only CSP to enforced CSP in `nginx/nginx.conf` (and mirror it in `ssl.conf`).

Notes:
- `ssl.conf` mirrors the same proxying as `nginx/nginx.conf` for `/app/*`, `/api/*`, and `/uploads/*`.
- If you change proxy paths/upstreams in `nginx/nginx.conf`, make the same changes in `ssl.conf`.

5) Monitoring

- Add analytics and error tracking (e.g., Sentry DSN) via env if desired.

6) QA

- Run Lighthouse (PWA/Perf/Accessibility/SEO) and cross-device smoke tests.

# Docteck

Docteck is a modern web application designed to streamline appointment scheduling, billing, and task management for healthcare professionals and their clients. Built with React for the frontend and Node.js for backend services, Docteck provides a seamless experience for managing calendars, handling payments, and tracking daily tasks—all in one place.

## Features

- **Appointment Calendar:** Schedule, view, and manage appointments with an intuitive calendar interface.
- **Billing & Payments:** Securely handle billing and payments using Stripe integration.
- **Task Tracker:** Keep track of daily to-dos and important notifications.
- **User Authentication:** Secure login and registration for users.
- **Responsive Design:** Works across desktops, tablets, and mobile devices.

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone https://github.com/JEER11/Docteck.git
   cd Docteck
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in your API keys and secrets as needed.
   - **Note:** The `.env` file is not tracked by git for security reasons.

### Google Calendar connection (OAuth)

Set these in the root `.env` (preferred). The Node server now loads root `.env` first, then `server/.env` for optional overrides.

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
# For local dev with Node backend on :3001:
GOOGLE_REDIRECT_URI=http://localhost:3001/api/auth/google/callback
```

Also add the redirect URI in Google Cloud Console → Credentials → OAuth 2.0 Client IDs → Authorized redirect URIs.
If you serve everything from Flask only, point to Flask’s host/port instead.

> React SPA served by Python Flask, with classic HTML pages available for reference.

## Overview

- Flask (`python_server/app.py`) serves the React build under `/app/*` and exposes JSON APIs under `/api/*`.
- Classic HTML templates are available under `/classic/*` for comparison.
- APIs can be “hidden/private” by setting `API_SECRET` (see Security).

## Prerequisites

- Node.js 18+
- Python 3.10+

## Quick start (Windows PowerShell)

```powershell
# 1) Install dependencies
npm ci

# 2) Python venv and deps
python -m venv .venv
& .\.venv\Scripts\Activate.ps1
pip install -r python_server\requirements.txt

# 3) Build the React app (served by Flask)
npm run build

# 4) Run Flask (serving the SPA on one port)
$env:PORT=5050
python .\python_server\app.py
# Open http://127.0.0.1:5050/app/dashboard  (and /dashboard redirects there)
```

## Security

- Set `API_SECRET` in `.env` (root) to require the header `X-API-SECRET` on all `/api/*` requests.
- Example test:
```powershell
# 401 without secret
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:5050/api/hello
# 200 with secret
Invoke-WebRequest -UseBasicParsing -Headers @{ 'X-API-SECRET'='your-strong-secret' } http://127.0.0.1:5050/api/hello
```

## Dev mode (optional)
- React dev server on :3000 and Flask on :5000
```powershell
# Terminal 1
npm start
# Terminal 2
& .\.venv\Scripts\Activate.ps1
$env:PORT=5000
python .\python_server\app.py
```

## Environment
- Copy `.env.example` to `.env` and set values (PORT, API_SECRET, Stripe, SMTP, etc.).
- `.env` is ignored by git.

## License
MIT

---

## Demo 

<img width="897" height="920" alt="image" src="https://github.com/user-attachments/assets/f1d739c0-4837-4601-9df1-c19280736080" />
<img width="895" height="909" alt="image2" src="https://github.com/user-attachments/assets/23a23ac0-b6c2-4ea9-9a4d-36999f67c3e5" />
<img width="896" height="918" alt="image3" src="https://github.com/user-attachments/assets/6d76144e-0a42-48ed-bf3e-0f06616f131d" />
<img width="897" height="907" alt="image4" src="https://github.com/user-attachments/assets/db862300-8da3-4df3-89a4-6bd34f46d626" />

<<<<<<< HEAD

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

Set these environment variables in `server/.env` (create if missing):

```
# Docteck-Classic-

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
- The compose setup mounts service folders read-only into containers for quick iteration; change as needed for development.

Flask microservice for AidashGent

Quick start (PowerShell on Windows):

1. Create a virtualenv and activate it:

    python -m venv .venv
    .\\.venv\\Scripts\\Activate.ps1

2. Install dependencies:

    pip install -r requirements.txt

3. Run the app:

    # Option A (Flask CLI)
    $env:FLASK_APP = "app.py"
    python -m flask run --host=0.0.0.0 --port=5000

    # Option B (direct)
    python app.py

Endpoints:

- GET /api/hello  -> { message: "Hello from Flask", success: true }
- POST /api/echo  -> echoes JSON body
- GET /health     -> returns 200 OK

Notes:
- CORS is enabled for /api/* (development convenience). Restrict origins in production.
- Use a production WSGI server (gunicorn, waitress, etc.) when deploying.
- React SPA is served under /app/* from the repository build/ directory.
- Set API_SECRET in .env to require header X-API-SECRET on all /api/* requests.
- API_STEALTH_404=1 causes unauthorized API calls to return 404 instead of 401.
- API_RATE_LIMIT_PER_MINUTE throttles per-IP requests to /api/* (0 disables).

Server setup

1) Copy .env.example to .env and set keys

- STRIPE_SECRET_KEY (required for payments)
- FLASK_URL (default http://localhost:5000)
- GOOGLE_CLIENT_ID/SECRET/REDIRECT_URI (for Google Calendar connect)
- OPENAI_API_KEY / GROQ_API_KEY (optional)
- SMTP_* (optional; email OTP)

2) Install deps and start

- npm install
- node index.js

Health check: http://localhost:3001/health

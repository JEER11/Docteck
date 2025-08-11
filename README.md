
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
GOOGLE_CLIENT_ID=your_oauth_client_id
GOOGLE_CLIENT_SECRET=your_oauth_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3001/api/auth/google/callback
```

Then start both server and client:

```
npm run dev
```

Open Profile > Account settings > Connect Calendar, choose "Connect Google Calendar". A popup will ask you to sign in and authorize read-only access. On success, the app stores tokens locally (for demo) and shows "Calendar Connected".
4. **Start the development server:**
   ```sh
   npm start
   ```

## Folder Structure

- `src/` — Frontend React code
- `server/` — Backend Node.js code (not included in public repo)
- `public/` — Static assets and HTML
- `uploads/` — User-uploaded files (ignored by git)

## Credits

- **Project Lead:** JEER11
- **Special Thanks:** Tim, for significant contributions throughout the project design.

## License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for details.

---

### Additional Credits

This project was originally bootstrapped with [Vision UI Dashboard React](https://www.creative-tim.com/product/vision-ui-dashboard-react?ref=readme-vudreact) by Creative Tim and Simmmple. Some UI elements and structure are based on their open-source template.

For more information, see the original [Vision UI Dashboard React documentation](https://www.creative-tim.com/learning-lab/react/overview/vision-ui-dashboard/?ref=readme-vudreact).

---

© 2025 JEER11. All rights reserved.

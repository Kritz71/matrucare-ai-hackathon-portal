# MatruCare AI Hackathon Portal

A MERN application starter for the MatruCare AI National Hackathon 2026 internship assignment. It includes email/password signup, single-use 6-digit email OTP verification, JWT authentication, participant dashboard, profile update, hackathon registration with dynamic team member fields, registration lookup/withdrawal, and Nodemailer email templates.

## Repository structure

```text
matrucare-hackathon-portal/
├── client/                 # React + Vite + Tailwind CSS
│   ├── src/components/     # Shared layout
│   ├── src/context/        # Authentication state
│   ├── src/lib/            # Axios client
│   └── src/pages/           # Page components are in App.jsx
└── server/                 # Express + MongoDB API
    ├── config/             # Database connection
    ├── controllers/        # API logic
    ├── middleware/         # JWT protection
    ├── models/             # Mongoose schemas
    ├── routes/             # API routes
    └── utils/               # Email and async utilities
```

## Requirements

- Node.js 20 or newer (Node 22 recommended)
- npm
- MongoDB Atlas cluster or local MongoDB
- Gmail account authorized to send mail as `matrucareai@gmail.com`, with a Google App Password (for final SMTP configuration)

## 1. Configure the backend

Open a terminal in the repository root:

```bash
cd server
npm install
```

In Windows PowerShell, copy the example file with `Copy-Item .env.example .env`. Then open `server/.env` in VS Code and fill in the values:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://...
JWT_SECRET=use_a_random_secret_at_least_32_characters_long
CLIENT_URL=http://localhost:5173
EMAIL_USER=matrucareai@gmail.com
EMAIL_PASS=your_google_app_password
```

Never commit `.env`. The sender header is deliberately fixed in code to `MatruCare AI <matrucareai@gmail.com>`. The application enforces `EMAIL_USER=matrucareai@gmail.com` and uses the exact required From header. Use an App Password authorized for that mailbox; personal Gmail credentials are not accepted by this starter because they cannot reliably send as the organisation mailbox. Email templates deliberately contain no candidate or personal sender name.

Start the API:

```bash
npm run dev
```

Check `http://localhost:5000/api/health`. It should return a JSON status response. The API waits for MongoDB before listening.

## 2. Configure the frontend

Open a second terminal from the repository root:

```bash
cd client
npm install
```

In a second PowerShell terminal, run `Copy-Item .env.example .env` from inside `client`, then set this value:

```env
VITE_API_URL=http://localhost:5000
```

Start Vite:

```bash
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

## 3. Main API endpoints

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/signup` | Public | Create pending account and email OTP |
| POST | `/api/auth/verify-otp` | Public | Verify 6-digit OTP |
| POST | `/api/auth/resend-otp` | Public | Resend OTP |
| POST | `/api/auth/login` | Public | Login and issue JWT |
| GET | `/api/user/me` | JWT | Get current profile |
| PUT | `/api/user/update` | JWT | Update full name |
| POST | `/api/hackathon/register` | JWT | Create hackathon entry and send confirmation email |
| GET | `/api/hackathon/my-entry` | JWT | Get current user's entry |
| DELETE | `/api/hackathon/:id` | JWT | Withdraw own entry |
| GET | `/api/health` | Public | Health check |

For protected endpoints, send `Authorization: Bearer <token>`.

## 4. Registration field rules

The registration form collects participant name, authenticated email, Indian mobile number, college, course, branch, year, domain, project name, PPT URL, prototype URL, optional demo URL, team size and team member details. Team size is limited to 1–5. Following the assignment's explicit dynamic-field instruction, a solo entry has zero additional member records; team size 2–5 renders that many member detail blocks.

## 5. Security and operational notes

- Passwords are hashed with bcrypt (12 salt rounds); plaintext passwords are never stored.
- OTP values are hashed before storage, expire after 10 minutes and are cleared after successful verification.
- Auth endpoints are rate-limited; API responses do not expose password or OTP hashes.
- JWT-protected operations scope registration reads/deletes to the signed-in user.
- Helmet and explicit CORS configuration are enabled.
- Confirmation email failure does not roll back a successfully saved registration; the API reports the email delivery status.
- This is a strong assignment starter, not a substitute for a production security review. Before public launch, add automated tests, stronger schema-level URL/email validation, CSRF strategy if switching to cookies, monitoring, backups, and a documented privacy/retention policy.

## 6. Deployment outline

### Render (backend)
- Create a Web Service connected to this repository.
- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `EMAIL_USER`, `EMAIL_PASS`, and `NODE_ENV=production`.

### Vercel (frontend)
- Import the same repository.
- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Set `VITE_API_URL` to the deployed Render API origin.
- Add a Vercel rewrite for SPA routing if deep links return 404 (see `vercel.json`).

After deployment, update Render's `CLIENT_URL` to the exact Vercel origin. Never place MongoDB, JWT or Gmail secrets in frontend environment variables.

## 7. Final test checklist

- [ ] Signup with a valid email; OTP arrives from MatruCare AI.
- [ ] Wrong, expired and reused OTPs are rejected.
- [ ] Resend OTP sends a new code and resets expiry.
- [ ] Unverified accounts cannot log in.
- [ ] Correct login opens dashboard; logout clears local session.
- [ ] Dashboard shows empty state before registration.
- [ ] Solo registration displays no extra member fields.
- [ ] Team size 3 displays three member detail blocks and saves them.
- [ ] Invalid mobile number and malformed URLs are rejected.
- [ ] Registration confirmation email includes project, domain and team.
- [ ] Profile update persists after refresh.
- [ ] A user cannot fetch or delete another user's registration.
- [ ] Test mobile layout at 375px and tablet/desktop widths.

## Notes

The frontend currently uses a `mailto:` contact form, which opens the visitor's email application rather than storing messages on the server. Event dates, prize amounts and official social links were not specified in the supplied assignment, so the landing page intentionally avoids inventing them.

# TextileTrace authentication - local development

The existing React frontend stays at the repository root. Only login and authentication have a real backend. Products, suppliers, certifications, passports, invitations and admin sample-user screens still use browser demo data; changing them never changes MongoDB account permissions.

## Start on Windows

Use Node.js 22.12+ and your existing MongoDB Windows service. No additional MongoDB installation is needed.

Terminal 1, from the project root:

```powershell
cd backend
npm install
# The generated .env already contains a random development secret.
# For a fresh checkout, copy .env.example to .env and replace JWT_SECRET.
npm run seed
npm run dev
```

Terminal 2, from the project root:

```powershell
npm install
npm run dev
```

Open http://localhost:5173/login (use localhost consistently). Vite proxies /api to http://127.0.0.1:5000. On restricted PowerShell installations use npm.cmd.

Database: mongodb://127.0.0.1:27017/textiletrace.
Health: http://localhost:5000/api/health.

## Development demo credentials

These fictional accounts are for local development only. All use password: `TextileDemo!2026`.

| Role | Email | Existing dashboard |
| --- | --- | --- |
| Manufacturer | manufacturer@textiletrace.example | /app/overview |
| Supplier | supplier@textiletrace.example | /app/supplier |
| Certification Reviewer | certification_reviewer@textiletrace.example | /app/evidence |
| Retailer | retailer@textiletrace.example | /app/retailer |
| Administrator | admin@textiletrace.example | /app/admin |

Seeding requires NODE_ENV=development, skips existing accounts, and never runs on server startup. It does not reset passwords or roles of existing accounts.

## Test the UI

Enter a seeded email and password and click Sign in. The saved account role determines the dashboard, regardless of Explore as. Reload to check session restoration; sign out with the header icon. Try a wrong password and a restricted route such as /app/admin with a manufacturer account. The header account role is read-only.

Registration creates only manufacturer accounts and a linked organization. There is no real invitation-based role provisioning; existing demo invitation links cannot grant account access. Password recovery has no email service and explicitly reports that no email was sent. Remember me does not extend the configured JWT lifetime.

## API and security

- POST /api/auth/register: fullName, email, password, organizationName, optional country. Extra fields (including role) are rejected.
- POST /api/auth/login: email, password.
- GET /api/auth/me: authenticated, active MongoDB user; never returns passwordHash.
- POST /api/auth/logout: expires the session cookie.
- GET /api/health: API and database status; disconnected database returns 503.

Send JSON for mutations and include cookies (`credentials: 'include'`). JWTs are never returned to JavaScript or stored in localStorage. The HttpOnly session cookie uses SameSite=Lax, Secure in production, and the configured JWT expiry. Local HTTP development requires Secure=false. Signatures require HS256, expected issuer/audience, and a valid subject; every authenticated request rechecks the database for active status and role. Logout clears the browser cookie; a separately copied token remains valid until expiry (no server-side revocation store).

Other protections: bcrypt cost 12, Zod validation, unique normalized email index, Helmet, exact allowed frontend CORS origin, JSON-only mutations with Origin validation, 20 login/register attempts per 15 minutes per IP, centralized safe errors, no-store responses. Registration passwords have at least eight characters and at most 72 UTF-8 bytes to avoid bcrypt truncation.

Use authenticate then requireRole(...) when future protected API modules are implemented. Only authentication APIs exist now. Tests exercise this middleware on a test-only admin probe, without adding domain APIs.

Production requires a new secret, NODE_ENV=production, HTTPS FRONTEND_URL, HTTPS hosting and a same-origin /api reverse proxy (Vite's development proxy is not part of dist). Rate-limit counters are per process; configure shared storage and trusted proxy settings if deploying behind a proxy or multiple instances. Never seed development accounts in production.

## Verification

From backend:

```powershell
npm run build
npm run seed
npm test
npm start
```

The integration test requires the local development textiletrace database and seeded accounts. It creates a unique temporary account/organization, cleans them up, and checks health, registration, duplicates, password hashing, safe output, all five roles, signature/expiry rejection, inactive users, current database roles, logout, CSRF/CORS and rate limiting. It binds an ephemeral local port.

From the project root:

```powershell
npm run build
npm test
npm run lint
npm run smoke
```

A full real-browser end-to-end run requires a browser automation environment.

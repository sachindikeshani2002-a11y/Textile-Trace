# ThreadTrace

A responsive textile Digital Product Passport demonstration built from scratch with React, TypeScript, Vite, Tailwind CSS, React Router, Lucide, Recharts, React Hook Form, Zod and qrcode.react.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Open http://127.0.0.1:5173. On Windows with restricted PowerShell execution policy, use `npm.cmd` instead of `npm`.

```sh
npm run build
npm run lint
npm test
npm run smoke
```

The production output is `dist/`. Configure your host to serve `index.html` for application routes. QR URLs use the current browser origin, so deploy to an accessible host before scanning from another device.

## Demo access

Open `/login`. Use `demo@threadtrace.example` and `threadtrace`, or any valid email and password of at least eight characters. Choose Manufacturer, Supplier, Reviewer, Retailer or Administrator. The header role selector lets you explore each role without creating external accounts. This is deliberately simulated access, not secure authentication.

## Connected walkthrough

1. Sign in as Manufacturer. Open Product Library → Add product. Complete the eight-step form, choose a supply partner and save. The product is persisted as a draft and receives a sourcing document request.
2. Switch to Supplier. Open Document Requests and choose Upload on the new product request. Select a real PDF, PNG or JPEG under 2 MB and enter its metadata. Submission updates the request and creates an unreviewed evidence record.
3. Switch to Reviewer. Open Evidence Vault → Review queue, inspect the attachment and add a note. Approve it or request changes. Approval updates the shared evidence record.
4. Switch to Manufacturer. Open Digital Passports, find the product, and Publish. Publication requires an approved evidence record. Unpublish hides its public story again.
5. Open QR studio, choose the product, download a real QR PNG, copy the public URL or print the label.
6. Switch to Retailer. Explore product access and the public passport. A local sample scan can be recorded in the retailer workspace.
7. Open the public passport URL without signing in. Explore the story, materials, approved public evidence, care and repair, and circularity sections.
8. Switch to Administrator and review the audit trail. Invite a demo collaborator, copy the local acceptance link, manage user roles, or disable a demo account.

## Screen and route inventory

All **41** enumerated screen experiences have routes; add/edit is one shared form, and customer sections use one parameterized route. Some advanced details are simplified as listed under limitations.

| Area | Routes |
| --- | --- |
| Public (4) | `/`, `/about`, `/how-it-works`, `/discover` |
| Authentication (3) | `/login`, `/register`, `/forgot-password` |
| Overview (2) | `/app/overview`, `/app/sustainability` |
| Products (4) | `/app/products`, `/app/products/:id`, `/app/products/new` or `/app/products/:id/edit`, `/app/products/:id/lifecycle` |
| Passports (3) | `/app/passports`, `/app/passports/:id`, `/app/qr?product=:id` |
| Supply chain (3) | `/app/supply-chain`, `/app/suppliers`, `/app/events` |
| Evidence (4) | `/app/evidence`, `/app/certifications`, `/app/evidence/:id`, `/app/reviews` |
| Supplier (3) | `/app/supplier`, `/app/requests`, `/app/upload` |
| Retailer (3) | `/app/retailer`, `/app/analytics`, `/app/retailer-products` |
| Administration (4) | `/app/admin`, `/app/users`, `/app/invitations`, `/app/audit` |
| Customer passport (5) | `/passport/:id`, `/passport/:id/materials`, `/passport/:id/certifications`, `/passport/:id/care`, `/passport/:id/circularity` |
| Settings (3) | `/app/settings`, `/app/integrations`, `/app/profile` |

## Architecture

- `src/data.ts`: typed products, evidence, supply partners, lifecycle events, requests, users, invitations, audit entries and synthetic scan records. Seed includes 12 products, 6 partners, 8 evidence records, 15 lifecycle events and 5 roles.
- `src/store.tsx`: React context state with a replaceable `demoService` persistence boundary. Mutations write to localStorage and append audit events. Data survives reloads on the same origin.
- `src/components/`: reusable visual primitives and responsive workspace shell.
- `src/pages/`: domain-focused pages, rather than one large application component.
- `src/App.tsx`: routing, demo session checks and selected role gates.
- `src/styles.css`: theme tokens, responsive layouts, focus states and print label rules; Tailwind is configured through its Vite plugin.

## Working capabilities

Product creation and editing, search, category/material/status filters, pagination, grid/table view, table bulk selection, source partner creation, supply-chain node inspection, event creation, evidence uploads and file validation, document preview/download, review notes and state transitions, publication gating, draft visibility, public passport sections, QR generation/download/printing, invitation creation/revocation/acceptance, local profile registration, role switching, user role changes and status changes, audit search/date filtering/export, synthetic analytics, exports, settings, notifications and toast feedback.

## Limits and honest demo boundaries

- Local browser storage is not a backend, a secure identity service, or an immutable audit log. Role gates demonstrate UI access only; they do not protect local data. Disable-user changes manage sample records, not authentication credentials.
- Sample certifications are fictional. Human approval in this demo is a workflow state, not third-party verification. No blockchain, government certification, AI scoring, or measured environmental savings are claimed.
- Supplier workspaces show shared demonstration data; multi-tenant isolation is not implemented.
- File attachments are base64-encoded in localStorage and limited to 2 MB each. Browser quota limits apply. This is unsuitable for real or sensitive documents.
- Photography and Google Fonts require internet access. Product photos are illustrative Unsplash images, with some reused across sample products.
- No email is sent. Recovery and invitations are explicitly local demonstrations. No ERP, Shopify, CSV import, camera scanner or real analytics integration is connected. JSON exports work; integration cards explain the remaining backend work.
- The traceability visualization is a connected node diagram, not an accurate geographic map. Trend history and scan events are synthetic and labeled accordingly.
- Product image upload uses a URL rather than file storage. Product gallery uses one primary photograph per sample product. Several advanced brief details (multi-fibre composition editing, collection filter, full lifecycle actor/date filtering, branded logo upload and real password changes) remain simplified.
- Physical QR scanning can use a phone camera on an accessible deployment. QR PNG downloads contain the code; print produces the styled label.
- Clear `threadtrace-demo-v1`, `tt-role`, `tt-auth` and `tt-preferences` from localStorage to reset the demonstration.

## Visual verification

Verified: TypeScript and production build (`npm run build`), ESLint (`npm run lint`), six relationship/publication tests (`npm test`), and server rendering for 42 routes covering 41 screen experiences plus edit (`npm run smoke`). Home and nested customer routes returned HTTP 200 from the development server. The final dependency installation reported zero vulnerabilities. A targeted minimatch override patches lint tooling; the lint check passes with it.

Responsive layouts target desktop, tablet and narrow mobile screens. Browser automation was unavailable, so real-browser visual inspection, camera scanning and end-to-end interaction testing were not performed. Server rendering does not replace those checks. Production build emits harmless annotation warnings from Zod; vendor chunks are separated to keep individual chunks below the default size warning threshold.

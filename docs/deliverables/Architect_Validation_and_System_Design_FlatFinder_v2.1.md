# Architect Validation & System Design — FlatFinder Web2 v2.1

Version: 1.0
Date: September 7, 2025
Owner: Architecture

Purpose
Validate the MVP charter from an architectural standpoint and define a concrete system design with particular attention to entitlement enforcement for freemium vs paid users (contact-info gating), repo structure, and integration boundaries.

Architecture Alternatives (from docs reconciliation)
- Option A (initial design): GCP Cloud Run API + Cloud Functions + Convex (DB)
- Option B (fullstack doc): Firebase Functions + Firebase Firestore + Next.js on Firebase Hosting

Recommendation (MVP practicality)
- Proceed with Option A for the following reasons:
  - Monorepo setup and current scaffolding already target Cloud Run + Functions
  - Convex simplifies real-time data and serverless access patterns; our repository pattern isolates vendor lock-in
  - Clerk/Stripe/WalletConnect/n8n integrations are platform-agnostic
- Keep Option B documented as a viable alternative if the team prefers Firebase's tighter integration. Data/repo abstractions facilitate a swap if needed.

1) Summary Assessment
- The MVP scope and architecture are aligned with a serverless-first strategy, focusing on proprietary matching/vetting while delegating non-core capabilities.
- Key reconciliation items from the detailed PRD have been incorporated: smoking policy semantics, budget flex, deposit law enforcement, reverse-image checks, and Alchemy KYC.

2) Reference System Diagram (Mermaid)
```mermaid
graph TD
  subgraph Client
    U[User (Renter)] --> W[Next.js Web App]
  end

  subgraph Auth & Payments
    W -- Auth --> C[Clerk]
    W -- Checkout/Portal --> ST[Stripe]
    W -- Wallet Connect --> WC[WalletConnect]
  end

  subgraph Backend (GCP)
    W -- API --> API[Cloud Run: Node.js API]
    API -- Read/Write --> DB[(Convex)]
    API -- Trigger --> OUT[Cloud Function: Outreach]
    SCR[Cloud Function: Scraper] -- Raw Listings --> API
    VET[Cloud Function: Vetting] -- Validate/Score --> API
    API -- Maps/Verify --> GM[Google Maps]
    API -- Verify --> REG[Land Registry APIs]
    API -- KYC --> ALC[Alchemy]
    API -- Webhook --> N8N[n8n Notifications]
  end

  subgraph External
    SCR --> CRAIG[Craigslist]
    SCR --> KIJI[Kijiji]
    OUT -- Email/SMS --> LL[Landlords]
  end
```

3) Repo Structure (no change)
- apps/web (Next.js)
- services/api (Cloud Run)
- services/functions/{scraper,vetting,outreach}
- packages/shared (types, DTOs)
- infra/gcp (IaC)

4) Data Model updates
- Add listing_contact table as before; ensure depositLawRegion on listing to apply rule checks (ON vs BC)
- Add kyc_status on user (unknown|pending|verified|rejected) with provider=Alchemy

5) Entitlement Enforcement (unchanged principle)
- UI gating + API middleware + repository separation + audit logging + metrics

6) API Sketch additions
- POST /kyc/webhook (Alchemy) → update kyc_status
- Vetting includes rule check: deposit amount conforms to regional law; reverse-image detection flag on listing

7) Security & Compliance
- Treat contact and KYC data as sensitive; minimize fields; redact in logs

8) Testing
- Add tests for deposit law rule enforcement and reverse-image flagging in vetting function

9) Next Steps
- Confirm Option A vs Option B; proceed with IaC and CI setup for chosen path
- Import detailed PRD acceptance nuances into PM backlog

B. API Layer (Cloud Run Node.js)
- Middleware: Resolve user from Clerk session; fetch tier/entitlements; attach to request context.
- Endpoints:
  - GET /matches — Returns listings without contact info. Response includes entitlement flags per user.
  - GET /listings/:id — Returns listing details without contact info (free) or with contact info (paid) based on entitlement check.
  - GET /listings/:id/contact — Paid-only endpoint that returns contact details; logs to audit_log with actor, listingId, timestamp.
- Stripe/WalletConnect Webhooks: Update entitlement_event and current tier atomically; invalidate user cache; reflect entitlement immediately.

C. Data Access Layer (Repository Pattern)
- Separate repositories for listing and listing_contact; listing repository never joins contact data by default.
- Paid code paths must explicitly request contact repository; guard with entitlement check.

D. Observability & Controls
- Metrics: contact_view_requests_total, contact_view_denied_total, upgrades_after_view_matches_total.
- Alerts: Spike in denied contact requests; anomaly in webhook failures.
- Rate limiting: Protect /listings/:id/contact and outreach endpoints.

6) API Sketch (Types/DTOs)
- GET /matches → { items: Array<{ id, title, price, location, photos, contactAvailable: boolean }>, entitlements: { canViewContact: boolean } }
- GET /listings/:id → { id, ... , contact: canViewContact ? { redacted: false, email, phone } : { redacted: true } }
- GET /listings/:id/contact → { email, phone } (paid-only)
- POST /outreach-requests → { status } (paid-only)

7) Stripe/WalletConnect Integration
- Stripe Checkout/Portal → webhook: customer.subscription.updated → set tier based on product mapping.
- WalletConnect flow → upon on-chain verification or purchase, call backend to grant entitlements; verify signatures server-side.
- Maintain product-to-tier mapping in config; validate on webhook.

8) Security & Privacy
- Minimize PII; treat contact data as sensitive; log access in audit_log; redact by default.
- Do not store payment details; rely on Stripe/WalletConnect payloads and IDs.
- Validate scraper inputs; sanitize all external data.

9) Performance & Scalability
- Cache entitlement lookup per request using short-lived cache (e.g., in-memory per instance) + ETag for matches.
- Use event-driven functions for scraping/vetting; keep API latency-focused.

10) Testing Strategy
- Unit: repositories and entitlement middleware.
- Integration: /listings/:id and /listings/:id/contact with free vs paid users.
- E2E: Upgrade flow → entitlement unlock → contact endpoint → outreach request.

11) Risks & Mitigations (Design-Specific)
- Contact leakage via logs/screenshots → Redact in logs by default; mask in non-paid responses; secure admin tooling.
- Race between upgrade and entitlement propagation → Webhook idempotency + immediate cache invalidation; poll Stripe as fallback.
- Scraper selector drift → Centralize selectors per source; add synthetic tests; monitor 4xx/5xx rates.

12) Next Steps
- Confirm repo structure and generate skeleton (apps/web, services/api, services/functions/*, packages/shared).
- Define TypeScript types in packages/shared and wire minimal DTOs for matches/listings.
- Add entitlement middleware stub, route scaffolds, and mock data to validate gating end-to-end.
- Create Stripe product mapping and webhook handler skeleton; add feature flags into frontend.

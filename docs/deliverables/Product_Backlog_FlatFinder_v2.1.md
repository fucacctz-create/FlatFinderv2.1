# Product Backlog — FlatFinder Web2 v2.1 (MVP)

Version: 1.0
Date: September 7, 2025
Owner: Product/PM (sourced from MVP Charter, PRD F, Architecture docs)

Overview
This backlog translates the MVP Charter and reconciled PRD/Architecture into epics and implementable user stories with acceptance criteria. Platform: Option A (GCP Cloud Run + Cloud Functions + Convex) is recommended; items are written to remain platform-agnostic where possible.

EPIC 1 — Foundation & Core Services
1.1 Monorepo scaffolding complete
- As a developer, I can run the frontend, API, and functions locally.
- AC: npm run dev spins up API and web; shared package compiles; tsconfig path aliases work.

1.2 Auth via Clerk
- As a user, I can sign up/sign in using email/social providers.
- AC: Clerk embedded; session established; protected routes redirect unauth.

1.3 User model baseline
- As a developer, I have a User and Profile schema persisted in the DB.
- AC: Create/read/update Profile for logged-in user works via API; kyc_status field present.

EPIC 2 — Data Pipeline & Vetting
2.1 Craigslist/Kijiji scraping (twice daily)
- As a system, I ingest listings from target cities and boroughs.
- AC: Scheduler triggers scraping; raw listings normalized and stored.

2.2 Automated vetting (keywords, address, reverse-image)
- As a system, I auto-flag scams/low-quality listings before display.
- AC: Keyword rules; Google Maps geocoding; reverse-image/duplicate check; risk score assigned.

2.3 Deposit law enforcement (ON/BC)
- As a renter, I’m protected from unlawful deposit requirements.
- AC: Region on listing; rules (ON: first/last only; BC: half-month); violations flagged/blocked.

2.4 Landlord verification (Alchemy KYC + ownership)
- As a renter, I see listings from verified landlords/agents.
- AC: Alchemy KYC webhook → kyc_status update; ownership check (OnLand/LTSA/utility bill) recorded; non-owners provide authorization.

2.5 Human-in-the-loop review
- As a moderator, I can review low/medium risk listings.
- AC: HIL queue; approve/reject with audit trail; high-risk auto-ban.

EPIC 3 — Onboarding & Profile
3.1 Onboarding chatbot questionnaire
- As a user, I complete a conversational questionnaire to set my preferences.
- AC: Captures city, property type/size, amenities, lifestyle (pets/smoking), subjective preferences.

3.2 Smoking policy semantics
- As a user with health constraints, I can specify a strictly non-smoking requirement.
- AC: Multi-choice distinguishes preference vs health-based; HC context note shown; stored on profile.

3.3 Budget calculation with flex
- As a user, I receive a recommended budget with option to flex up to +5%.
- AC: After-tax income input; recommended budget calculated; flex control persisted.

3.4 Optional financial verification
- As a user, I can optionally upload a bank statement to support anti-gatekeeping.
- AC: Upload accepted; “provided: true/false” captured; secure storage link (no PII exposure in logs).

EPIC 4 — Matching & Dashboard
4.1 Matching engine baseline
- As a user, I see ranked “hidden gem” matches personalized to my profile.
- AC: Min 5 matches for typical profile; deterministic sort; score surfaced.

4.2 Match cards UI
- As a user, I see a clean card with title, price, location, photos, and contactAvailable flag.
- AC: Contact info field redacted for free tier; upgrade CTA visible.

4.3 Save/dismiss & weekly quota
- As a user, I can save or dismiss matches; free tier limited to 3/week.
- AC: Persisted actions; free quota enforced in API and UI.

EPIC 5 — Entitlements & Gating
5.1 Tier mapping & entitlement resolver
- As a system, I map Stripe/WalletConnect products to app tiers and entitlements.
- AC: Tier → {canViewContact, canRequestOutreach, weeklyMatchQuota}; cacheable resolver middleware.

5.2 API enforcement for contact details
- As a system, I enforce contact info gating at the API boundary.
- AC: /listings/:id returns redacted contact for free; /listings/:id/contact requires canViewContact.

5.3 UI enforcement & upgrade CTA
- As a user, I see clear upgrade prompts where features are gated.
- AC: Contact buttons disabled on free; CTA triggers checkout.

5.4 Audit logging & metrics
- As a system, I audit access to sensitive contact details and collect entitlement enforcement metrics.
- AC: Structured logs with user/listing IDs; dashboards show blocked vs allowed requests.

EPIC 6 — Premium Features & Monetization
6.1 Stripe checkout & customer portal
- As a user, I can upgrade/downgrade/cancel via Stripe.
- AC: Product SKUs created; webhook updates entitlements; portal link in settings.

6.2 WalletConnect crypto payments
- As a user, I can pay with crypto.
- AC: WalletConnect integration; subscription/tier parity with Stripe; entitlements updated.

6.3 Contact unlock post-upgrade
- As a premium user, I immediately see unredacted contact info.
- AC: Entitlement cache invalidation on webhook; UI reflects change without logout.

6.4 Automated landlord outreach
- As a premium user, I request outreach with my availability.
- AC: Outreach function emails/SMS landlords; status visible on dashboard; retries & failure reporting.

6.5 Multi-channel notifications (dashboard/email/SMS)
- As a premium user, I receive confirmations and reminders and can confirm via interactive action.
- AC: n8n flows or direct provider integration; user preferences for channels.

EPIC 7 — Marketing Site & Support
7.1 Landing page (Webflow acceptable)
- As a visitor, I understand the value prop and join the waitlist.
- AC: Live landing page; responsive; tracked CTAs; basic SEO.

7.2 FAQ chatbot
- As a visitor, I get automated answers to common questions.
- AC: Knowledge base hookup; escalation path to human.

7.3 Contact/waitlist forms → marketing automation
- As a marketer, I receive structured leads/events in n8n.
- AC: Webhooks from forms into n8n; tagging and notifications set up.

EPIC 8 — Infra, CI/CD, Security
8.1 Infra plan for Cloud Run/Functions
- As a developer, I have repeatable infra definitions.
- AC: IaC for Cloud Run, Functions, Scheduler, Secret Manager; envs (dev/prod).

8.2 CI/CD
- As a developer, my changes auto-build, test, and deploy.
- AC: GitHub Actions or Cloud Build pipelines; preview deployments; lint/tests enforced.

8.3 Observability
- As an operator, I can monitor health, usage, and errors.
- AC: Logs, metrics, alerts; tracing on API and functions.

8.4 Security & compliance
- As a platform owner, I minimize risk handling sensitive data.
- AC: Secrets management; PII redaction; least-privilege service accounts; data retention policy.

Notes & Dependencies
- Alchemy KYC for landlord verification; Google Maps for geocoding; reverse-image provider TBD
- Stripe/WalletConnect product-to-tier mapping shared across API and web
- Entitlement enforcement must be consistent UI+API with audit logs

Appendix: Definitions of Done
- Code reviewed; tests (where applicable) passing; lint clean
- Observability hooks in place for new services/endpoints
- Documentation updated (README, API docs, runbooks)

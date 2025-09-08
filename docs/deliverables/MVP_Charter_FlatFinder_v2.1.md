# MVP Charter: FlatFinder Web2 v2.1

Version: 1.0
Date: September 7, 2025
Owner: Product (with Analyst support)

Executive Summary
FlatFinder is an AI-powered rental matchmaking web app for the “99%” in high-cost cities (initially Toronto and Vancouver). The MVP validates personalized matching, robust listing vetting, and a smooth onboarding-to-viewing flow. We will outsource non-core functions (auth, payments, notifications, DB) to de-risk delivery and focus on our proprietary questionnaire and matching algorithm. Our prime directive is user safety and trust (“safe as kittens”). Success is measured by conversion through onboarding, quality of matches, and user willingness to pay for premium outreach.

Goals (MVP)
- Validate the core value proposition of personalized, AI-assisted rental discovery
- Build scraping + multi-stage vetting to reduce scams/low-quality listings
- Deliver a seamless onboarding and matching experience
- Stand up monetization via freemium + subscriptions (Stripe, WalletConnect) with contact info and outreach gated behind paid tiers

// BEGIN PRD ADDITIONS
Core User Journeys (MVP)
1) Onboarding & Profile
   - Auth via Clerk; first-login chatbot questionnaire captures income, bedrooms/bathrooms, lifestyle needs (pets, smoking), and subjective preferences
   - Smoking policy: multi-choice distinguishing preference vs health-based requirement (with Health Canada context note)
   - Budget: auto-calculated from after-tax income with an option to flex up to +5%
   - Location and amenities: target city (Toronto/Vancouver) and toggles (parking, in-unit laundry, private entrance, etc.)
   - Optional financial verification (bank statement) to support anti-gatekeeping model
2) Discovery & Matching
   - Twice-daily scraping from Craigslist & Kijiji feeds into vetting pipeline
   - Automated checks (keywords, address validity via Google Maps, reverse-image/duplicate detection) + deposit law enforcement (e.g., ON first/last; BC first/half-month)
   - Landlord verification: public records (OnLand/LTSA), utility bills, phone verification; KYC supported by Alchemy; non-owners require authorization letters
   - Human-in-the-loop review queue for low/medium risk; auto-ban for high risk
   - Personalized matching surfaces “hidden gems” in a user dashboard
   - Freemium gating: Users on the free tier can see matched listings but NOT landlord contact details; clear upgrade CTA to unlock contact info and outreach
3) Premium Outreach & Notifications
   - Paid tiers: Premium users select listings and share availability
   - Outreach agent schedules viewings via email/SMS to landlords; confirmations and reminders delivered via dashboard, email, SMS
4) Marketing Site & Support
   - Public landing page, FAQ chatbot, and waitlist/contact forms triggering n8n workflows; initial landing page design may be delivered via Webflow
// END PRD ADDITIONS

Scope (What We Will Build)
- Frontend (Next.js)
  - Landing page, auth flows, onboarding chatbot, user dashboard (matches), premium upsell
  - Styling via Tailwind CSS or Styled-Components (finalize during design); animations with GSAP
  - State via React Context for simple flows; Zustand/Redux Toolkit if complexity requires
- Backend (Node.js on Cloud Run)
  - REST/Graph API for onboarding data, matching queries, and premium actions
  - Repository pattern to abstract Convex DB access
  - Webhooks for Stripe/WalletConnect events; webhook to n8n for notifications
  - Integrations: Google Maps (validation), Land Registry APIs (OnLand, LTSA) as needed
- Data & Pipelines
  - Convex as primary database for users, profiles, listings, matches, and events
  - Scraping agent(s) using Puppeteer/Playwright (scheduled)
  - Vetting Cloud Function: automated checks, risk scoring, HIL queue routing
  - Outreach Cloud Function: schedules viewings; rate-limited and auditable
- Monetization
  - Freemium (3 matches/week; no landlord contact details; no automated outreach)
  - Paid tiers: Unlock landlord contact details, automated outreach, and increased match quotas
  - Stripe + WalletConnect checkout and entitlement management

Architecture Summary
- Serverless-first on GCP: Cloud Run (API), Cloud Functions (scrape, vetting, outreach), Convex (DB)
- Decoupled, event-driven pipelines; minimal state in functions; DB as source of truth
- Third-party delegation: Clerk (auth), Stripe/WalletConnect (payments), n8n (notifications)

Data Model (Initial Draft)
- User: id, authId (Clerk), profileId, tier, createdAt
- Profile: id, userId, incomeAfterTax, bedrooms, bathrooms, lifestyle (pets, smoking, etc.), subjectivePrefs (json), verifiedFinancials (bool/metadata)
- Listing: id, source (craigslist/kijiji), raw, normalized, vettingStatus, riskScore, location, images, flags
- Match: id, userId, listingId, score, reasoning (minimal text), createdAt
- OutreachRequest: id, userId, listingId, availability, status, messages[]
- Event: id, type, payload, createdAt (for analytics and auditing)

Success Metrics (MVP)
- Activation: % of signups completing onboarding questionnaire (target ≥ 60%)
- Matching Quality: Avg match acceptance rate (target ≥ 25% of presented matches saved)
- Premium Conversion: % users upgrading within 14 days (target 5–10%)
- Listing Integrity: % of flagged listings caught before user exposure (target ≥ 90%)
- Time-to-Viewing: Median time from premium request to confirmed viewing (target ≤ 48 hours)
- Contact Unlock Conversion: % of users who upgrade to access landlord contact details after viewing matches (target TBD)

Risks & Mitigations
- Scraping fragility → Use Playwright/Puppeteer with resilience patterns; maintain source-specific selectors; add monitoring
- Data integrity/legal risk → Keep only necessary data; respect robots/ToS; prioritize landlord self-submission in future
- Identity/ownership verification complexity → Start with pragmatic checks; iterate with OnLand/LTSA integrations
- Payment/crypto compliance → Delegate to Stripe/WalletConnect; do not store sensitive payment data
- Scalability of HIL review → Build triage queue with SLA thresholds; prioritize by risk score
- Matching quality uncertainty → Start with rules-based + weighted scoring; instrument feedback loops for training later

Phased Milestones (12–14 weeks)
- Phase 0 (1–2 wks): Repo setup, environments, CI/CD, baseline infra (Cloud Run, Convex, Clerk, Stripe test), skeleton UI
- Phase 1 (3–4 wks): Onboarding chatbot, profile store, initial matching (rules/weights), dashboard v1
- Phase 2 (3–4 wks): Scrapers + vetting pipeline (automated checks, HIL queue), basic admin review tools
- Phase 3 (2–3 wks): Premium outreach + notifications (n8n), subscription tiers + entitlements
- Phase 4 (1–2 wks): Hardening, observability, analytics, polish, launch readiness

Acceptance Criteria (sample, MVP)
// BEGIN PRD ADDITIONS
- Users can sign up via Clerk and complete a multi-step questionnaire; data persisted in Convex (or Firestore — see Architecture Alternatives)
- Questionnaire includes smoking policy with health-based option and a budget flex control up to +5%
- Scrapers ingest new listings twice daily; automated vetting assigns risk scores; flagged items go to HIL queue; deposit law rules enforced; reverse-image checks performed
- Landlord verification supports Alchemy KYC and ownership checks (OnLand/LTSA) where applicable; high-risk actors auto-banned
- Matching returns at least 5 relevant listings for a typical profile; users can save/dismiss
- Freemium gating enforced: landlord contact details are hidden in UI and protected by API/entitlements; upgrade CTA is visible
- Upon successful upgrade, contact details become visible and outreach request flow is enabled immediately
- Premium users can request outreach; system sends confirmations/reminders; status tracked end-to-end
- Stripe/WalletConnect upgrades reflect immediately in entitlements and UI
- Landing page live (Webflow design acceptable for MVP); contact/waitlist forms trigger n8n
// END PRD ADDITIONS

- Users can sign up via Clerk and complete a multi-step questionnaire; data persisted in Convex
- Scrapers ingest new listings twice daily; automated vetting assigns risk scores; flagged items go to HIL queue
- Matching returns at least 5 relevant listings for a typical profile; users can save/dismiss
- Freemium gating enforced: landlord contact details are hidden in UI and protected by API/entitlements; upgrade CTA is visible
- Upon successful upgrade, contact details become visible and outreach request flow is enabled immediately
- Premium users can request outreach; system sends confirmations/reminders; status tracked end-to-end
- Stripe/WalletConnect upgrades reflect immediately in entitlements and UI
- Landing page + FAQ chatbot live; contact/waitlist forms trigger n8n

Open Questions
- Final choice: Tailwind vs Styled-Components for MVP
- Platform decision: Convex + Cloud Run vs Firebase Firestore + Cloud Functions (see Architecture Alternatives)
- Minimum acceptable verification for landlords in MVP (what is “enough” to start?)
- Specific city neighborhoods/regions to include at launch
- Exact subjective preference questions for best signal; sources for “duplicate/stock image” detection
- Pricing details for tiers and any discounting/intro offers

Appendix A: References
- PRD: docs/PRD/PRD_FlatFinder_Web2_MVP.md and docs/deliverables/Product Requirements Document (PRD): F.md
- Architecture: docs/Architecture_FlatFinder_Web2_MVP/Architecture_FlatFinder_Web2_MVP.md and docs/deliverables/Fullstack Architecture Document
- Backend: docs/backend architecture/Backend Architecture.md
- Frontend: docs/front-end architecture/frontend architecture.md
- Key Workflows: docs/key workflows/Key Workflows.md
- Project Brief: docs/project brief/Project_Brief_FlatFinder.md
- Tech Stack: docs/Technology-Stack/Technology Stack.md

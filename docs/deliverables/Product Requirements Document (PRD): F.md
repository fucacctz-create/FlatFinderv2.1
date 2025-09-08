# Product Requirements Document (PRD): FlatFinder Web2 MVP
**Version:** 1.0
**Date:** September 7, 2025

## 1. Introduction & Goals
This document outlines the requirements for the Minimum Viable Product (MVP) of the FlatFinder Web2 application.

* **Goal 1:** Validate the core value proposition of AI-powered, personalized rental matchmaking that eliminates the stress and anxiety of finding a home.
* **Goal 2:** Build a robust system for scraping, vetting, and filtering rental listings to eliminate scams and low-quality options. The system's prime directive is user safety and trust, embodied by the "safe as kittens" principle.
* **Goal 3:** Create a seamless, conversational, and efficient user experience, from onboarding to scheduling viewings.
* **Goal 4:** Establish a functional monetization system with clear user tiers, including both fiat and crypto payment options.

## 2. User Personas
* **Primary User:** The "99%." Individuals and families with variable or non-traditional income streams (e.g., freelance artists, gig workers, small business owners) living in high-cost-of-living urban areas (initially Toronto & Vancouver). They value their time and are looking for a trustworthy service to find a quality home that meets their unique needs and fits within a responsible budget (approx. 1/3 of income).
* **Excluded:** High-net-worth individuals seeking luxury rentals and users seeking government-subsidized housing.

## 3. Features & Functional Requirements

### 3.1. User Onboarding & Profile
* **FR1: User Account Creation:** Users can sign up and log in using standard email/password or social logins, managed by **Clerk**.
* **FR2: Onboarding Chatbot:** Upon first login, users are greeted by a friendly, conversational chatbot that administers a detailed questionnaire to determine their unique preferences.
* **FR3: Questionnaire:** The chatbot-based questionnaire will collect:
    * **Location:** Target City (Toronto, Vancouver).
    * **Property Specs:** Type of home (apartment, house, etc.), size (studio, 1 bed, etc.).
    * **Amenities:** Checkboxes/toggles for must-haves like parking, in-unit laundry, and private entrance.
    * **Smoking Policy:** A multi-choice question to distinguish between preference and a health-based requirement for a strictly non-smoking environment (including cannabis). Will include a note referencing Health Canada for context.
    * **Financials:** User-provided annual after-tax income to calculate a recommended budget.
    * **Budget Flexibility:** An option for the user to increase their calculated budget by up to 5%.
* **FR4: Alternative Financial Verification:** Users can optionally provide a bank statement showing sufficient funds as an alternative to traditional income/credit checks to support the "anti-gatekeeping" model.

### 3.2. Property Discovery & Matching
* **FR5: Listing Aggregation:** A scraping agent (using Puppeteer & Playwright) will pull rental listings from Craigslist and Kijiji for target cities and their surrounding boroughs. Scraping will occur at least twice daily.
* **FR6: Scam & Quality Filtering (The Vetting Workflow):** All scraped listings must pass through a multi-stage vetting process before being shown to users.
    * **Automated Scan:** Flags and rejects listings with common scam phrases ("wire transfer," etc.), verifies address validity (Google Maps), checks for duplicate/stock images (reverse image search), and enforces local deposit laws (e.g., first/last in Ontario, first/half-month in BC).
    * **Landlord Verification:** For landlords listing directly, the system will require verification of property ownership via public records (OnLand, LTSA), utility bills, and phone calls. KYC will be handled by **Alchemy**. Non-owners must provide a letter of authorization.
    * **Human-in-the-Loop:** Listings with low/medium risk flags are queued for manual review. High-risk listings/users are automatically banned.
* **FR7: Matchmaking Algorithm:** The core engine matches a user's unique questionnaire profile against the vetted listing database. The definition of a "hidden gem" is entirely determined by the individual user's preferences.
* **FR8: User Dashboard:** A clean, intuitive dashboard where users can view their personalized matches, including photos and details.

### 3.3. Premium Features
* **FR9: Automated Landlord Outreach:** Premium subscribers can select listings and provide their viewing availability. The system will then automate contacting landlords to schedule viewings.
* **FR10: Multi-Channel Notifications:** Premium users will receive viewing confirmations and reminders via their dashboard, email, and SMS, with interactive options (e.g., "press 1 to confirm"). Basic users must contact landlords themselves.

### 3.4. Monetization
* **FR11: Freemium Tier:** Free access to create a profile and view a limited number of "teaser" matches (e.g., 3 per week).
* **FR12: Subscription Tiers:** Users can upgrade to paid plans ("Search Blitz," "Casual Searcher," "Premium") using **Stripe** for fiat currency and **WalletConnect** for cryptocurrency.

### 3.5. Public-Facing Website
* **FR13: Landing Page:** A visually appealing marketing page, with the initial design provided via **Webflow**.
* **FR14: Support Chatbot:** An automated chatbot trained on the knowledge base to answer FAQs.
* **FR15: Contact/Waitlist Forms:** Forms that trigger the marketing automation workflow.

## 4. Epics (High-Level)
* **Epic 1: Foundation & Core Services:** Project initialization, monorepo setup, database schema, user authentication with Clerk.
* **Epic 2: Data Pipeline & Vetting:** Build and deploy the scraping, filtering, and landlord verification agents.
* **Epic 3: User Onboarding & Matching Engine:** Develop the user-facing questionnaire chatbot and the core matchmaking algorithm.
* **Epic 4: Premium Features & Monetization:** Implement automated outreach, notifications, and subscription management with Stripe/WalletConnect.
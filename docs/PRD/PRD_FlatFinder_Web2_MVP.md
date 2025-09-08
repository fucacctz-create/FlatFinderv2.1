\# Product Requirements Document (PRD): FlatFinder Web2 MVP

\*\*Version:\*\* 1.0  
\*\*Date:\*\* September 7, 2025

\#\# 1\. Introduction & Goals  
This document outlines the requirements for the Minimum Viable Product (MVP) of the FlatFinder Web2 application.

\* \*\*Goal 1:\*\* Validate the core value proposition of AI-powered, personalized rental matchmaking.  
\* \*\*Goal 2:\*\* Build a robust system for scraping, vetting, and filtering rental listings to eliminate scams and low-quality options.  
\* \*\*Goal 3:\*\* Create a seamless and stress-free user experience, from onboarding to scheduling viewings.  
\* \*\*Goal 4:\*\* Establish a functional monetization system with clear user tiers.

\#\# 2\. User Personas  
\* \*\*Primary User:\*\* "The 99%" \- Individuals or families with variable or non-traditional income streams (e.g., freelance artists, gig workers, small business owners) living in high-cost-of-living urban areas. They are tech-savvy but time-poor, seeking a safe and efficient way to find a suitable rental home that aligns with a \~33% income-to-rent ratio.  
\* \*\*Secondary User (Future):\*\* Landlords who want access to pre-vetted, high-quality tenants.

\#\# 3\. Features & Functional Requirements

\#\#\# 3.1. User Onboarding & Profile  
\* \*\*FR1: User Account Creation:\*\* Users can sign up and log in using standard email/password or social logins, managed by \*\*Clerk\*\*.  
\* \*\*FR2: Onboarding Chatbot:\*\* Upon first login, users are greeted by a chatbot that administers a detailed questionnaire.  
\* \*\*FR3: Questionnaire:\*\* The questionnaire will collect data on user preferences, including but not limited to:  
    \* Annual after-tax income.  
    \* Desired number of bedrooms/bathrooms.  
    \* Lifestyle needs (e.g., pet-friendly, non-smoking).  
    \* Subjective preferences captured through non-obvious questions.  
\* \*\*FR4: Financial Verification (Optional):\*\* Users can optionally provide proof of funds (e.g., a bank statement) as an alternative to traditional credit checks.

\#\#\# 3.2. Property Discovery & Matching  
\* \*\*FR5: Listing Aggregation:\*\* A scraping agent will pull rental listings from Craigslist and Kijiji for Toronto and Vancouver (including specified surrounding areas). Scraping will occur at least twice daily.  
\* \*\*FR6: Scam & Quality Filtering:\*\* All scraped listings must pass through a multi-stage vetting process:  
    \* \*\*Automated Scan:\*\* Flags listings with suspicious keywords, invalid addresses (checked via Google Maps API), and duplicate/stock images.  
    \* \*\*Landlord Verification:\*\* Requires landlords who sign up directly to verify property ownership via public records (OnLand in Ontario, LTSA in BC), utility bills, and phone verification.  
    \* \*\*Manual Review:\*\* Listings flagged for low/medium risk will be sent to a human-in-the-loop queue for review.  
\* \*\*FR7: Matchmaking Algorithm:\*\* The system will match user questionnaire profiles against the vetted listing database to identify personalized "hidden gems."  
\* \*\*FR8: User Dashboard:\*\* Users will have a dashboard to view their matched properties, including details and photos.

\#\#\# 3.3. Premium Features  
\* \*\*FR9: Automated Outreach:\*\* Premium users can select listings and provide their availability. An agent will then automatically contact landlords via email or phone to schedule viewings.  
\* \*\*FR10: Multi-Channel Notifications:\*\* Premium users will receive viewing confirmations and reminders via their dashboard, email, and SMS, with options to confirm or reschedule.

\#\#\# 3.4. Monetization  
\* \*\*FR11: Freemium Tier:\*\* Users can sign up for free and see up to 3 matches per week.  
\* \*\*FR12: Subscription Tiers:\*\* Users can upgrade to paid plans ("Search Blitz," "Casual Searcher," "Premium") via Stripe (fiat) or WalletConnect (crypto).

\#\#\# 3.5. Public-Facing Website  
\* \*\*FR13: Landing Page:\*\* A marketing page explaining the service and its value proposition.  
\* \*\*FR14: Support Chatbot:\*\* An automated chatbot trained on the knowledge base to answer FAQs.  
\* \*\*FR15: Contact/Waitlist Forms:\*\* Forms that trigger the n8n notification workflow.

\#\# 4\. Epics (High-Level)  
\* \*\*Epic 1: Foundational Setup & Core Services:\*\* Project initialization, database schema, user authentication (Clerk), and basic application structure.  
\* \*\*Epic 2: Data Pipeline & Vetting:\*\* Build and deploy the scraping, filtering, and landlord verification agents.  
\* \*\*Epic 3: User Onboarding & Matching Engine:\*\* Develop the user-facing questionnaire chatbot and the core matchmaking algorithm.  
\* \*\*Epic 4: Premium Features & Monetization:\*\* Implement automated outreach, notifications, and subscription management with Stripe/WalletConnect.  

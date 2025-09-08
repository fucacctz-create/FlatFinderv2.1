\# Architecture Document: FlatFinder Web2 MVP

\*\*Version:\*\* 1.0  
\*\*Date:\*\* September 7, 2025

\#\# 1\. High-Level Architecture  
The system is a serverless web application built on Google Cloud Platform (GCP). It uses a React-based frontend, a Node.js backend API, and a Convex database. Key processes like scraping and notifications are handled by decoupled, event-driven Cloud Functions. Authentication and payments are delegated to third-party services (Clerk, Stripe, WalletConnect) to enhance security and reduce complexity.

\#\#\# 1.1. System Diagram

\`\`\`mermaid  
graph TD  
    subgraph User Interaction  
        User\[Renter\] \--\> WebApp\[Frontend App\]  
    end

    subgraph Authentication  
        WebApp \-- Login/Signup \--\> Clerk\[Clerk Auth\]  
        WebApp \-- Wallet Connect \--\> Wallet\[WalletConnect\]  
    end

    subgraph Backend Services (GCP)  
        WebApp \-- API Calls \--\> BackendAPI\[Backend API\]  
        BackendAPI \-- Data \--\> DB\[(Convex Database)\]  
        BackendAPI \-- Triggers \--\> Outreach\[Outreach Agent\]  
        Scraper\[Scraping Agent\] \-- Raw Data \--\> BackendAPI  
        BackendAPI \-- Verifies \--\> LandRegistry\[Land Registry APIs\]  
        BackendAPI \-- Verifies \--\> GoogleMaps\[Google Maps API\]  
    end

    subgraph External Services  
        Scraper \--\> Craigslist & Kijiji  
        Outreach \-- Emails/SMS \--\> Landlords  
        WebApp \-- Payments \--\> Stripe  
        BackendAPI \-- Webhook \--\> Marketing\[Marketing & Notification Service\]  
    end  

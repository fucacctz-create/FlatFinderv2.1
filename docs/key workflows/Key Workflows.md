### **Key Workflows**

* **User Onboarding:** Handled by the frontend application, interfacing with Clerk for authentication and the backend API to store questionnaire data in Convex.  
* **Property Vetting:** A multi-step process beginning with automated scraping, followed by filtering/validation via a Cloud Function, and routing edge cases to a human-in-the-loop review queue.  
* **Notifications:** The backend will fire a webhook to a dedicated n8n instance running on GCP to handle all marketing and transactional email/SMS.


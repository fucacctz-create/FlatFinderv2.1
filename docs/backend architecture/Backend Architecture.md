### **Backend Architecture**

* **Runtime:** Node.js on Google Cloud Run for the main API.  
* **Data Layer:** The Repository Pattern will be used to abstract all database interactions with Convex.  
* **Asynchronous Tasks:** Google Cloud Functions will be used for:  
  * **Scraping Agent:** Runs on a schedule to fetch new listings.  
  * **Outreach Agent:** Triggers when a premium user requests a viewing appointment.


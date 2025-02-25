# Crime Reporting System

This project provides an online platform for citizens to report crimes anonymously and allows law enforcement to efficiently manage and track those reports.  It aims to improve community safety and provide a secure and accessible way to report criminal activity.

- In development

## Features

This system offers the following key features:

### 1. User Authentication

* **Secure Login:**  Separate login functionalities for different user roles:
    * **Citizens:** Report crimes and track the status of their complaints.
    * **Police Officers:** Review and manage crime reports, update statuses, and investigate cases.
    * **Admin Users:** Oversee system operations, manage users, and generate statistical reports.
* **Anonymous Reporting:**  Citizens can report crimes without logging in, ensuring anonymity for sensitive cases.
* **Two-Factor Authentication (2FA):** Enhanced security for police officers and admin users.  *(Implementation details to be specified)*
* **Powered by Auth.js:** Leverages Auth.js for robust and secure authentication.

### 2. Report Crime

* **Detailed Crime Reporting:** Users can file comprehensive complaints including:
    * Crime type (e.g., Theft, Assault, Cybercrime).
    * Date, time, and location of the incident.
    * Detailed description of the event.
    * Option to attach supporting evidence (images, videos, audio, or documents).
* **Automatic Geolocation Tagging:**  The system automatically captures the location of the incident using geolocation services.
* **Urgency Marking:** Users can mark reports as "urgent" to prioritize immediate attention from law enforcement.

### 3. Crime Status Tracking

* **Real-time Status Updates:** Users can easily track the progress of their reported crime through various stages:
    * Submitted: Complaint received by the system.
    * Under Review: Assigned to a police officer for review.
    * Investigation Ongoing: Active investigation in progress.
    * Resolved: Case closed with details of the outcome.
* **Notifications:** Automatic email/SMS notifications are sent to users whenever the status of their report changes.

### 4. Admin Dashboard (For Police Officers & Admins)

* **Crime Report Management:** Comprehensive tools for managing crime reports, including review, assignment, and status updates.
* **Search and Filtering:**  Ability to search and filter complaints by location, crime type, urgency, and other criteria.
* **Reporting and Analytics:** Generate reports on crime trends, statistics, and other relevant data.
* **User Management:**  Admin users can manage user accounts, including approving new accounts and suspending accounts for misconduct.

### 5. Emergency Alerts

* **Real-time Alerts:** The system can send real-time alerts to users in affected areas about various emergencies:
    * Kidnapping alerts.
    * Riot or curfew updates.
    * Weather-related safety warnings.
* **Multiple Communication Channels:** Alerts are delivered via push notifications, SMS, and email for maximum reach.
* **Google Maps Integration:** Integration with the Google Maps API to define and visualize affected areas.


## Technologies Used

*   **Frontend:** Next.js 15
*   **UI Components:** Shadcn/ui
*   **Authentication:** Auth.js
*   **Backend:** *(Specify backend technology if applicable, e.g., Next.js API routes, Node.js/Express, etc.)*
*   **Database:** *(e.g., PostgreSQL, MySQL, MongoDB, etc.)*
*   **Mapping:** Google Maps API
*   **Messaging:** *(e.g., Twilio, Firebase Cloud Messaging, etc.)*

## Installation

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

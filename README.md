# 🎟️ Ticketorium
## Your Seat to Every Milestone

---

Ticketorium is a **React + Vite** web application for managing university events, ticketing, bidding, and dispute resolution.  
It supports multiple user roles and provides a fully interactive event ecosystem with a polished UI and smooth user experience.

---

Ticketorium is a modern, campus-focused event ticketing and seat reservation platform designed to make university events smoother, fairer, and more accessible for everyone. Built for high-demand moments like graduations, ceremonies, and major campus experiences, Ticketorium replaces outdated and stressful ticket distribution with a clean, intuitive, digital-first solution.
With Ticketorium, students, families, visitors, organizers, and administrators all get a tailored experience. Attendees can browse events, reserve seats, download tickets, join waitlists, and securely resell or transfer tickets within the community. This ensures that no seat is wasted and every opportunity is accessible. Organizers gain powerful tools to configure seating, validate tickets, monitor attendance, and view live event statistics, while administrators manage policies, pricing, user accounts, and event approvals through a simple centralized dashboard.
By combining efficient ticket management, transparent reselling, and a polished user interface, Ticketorium improves the entire event journey from planning to participation. It provides reliability for organizers, fairness for students, and convenience for every user involved. Ticketorium’s mission is simple:
Connect people to the moments that matter with ease, trust, and confidence.

---

### Note:

The main branch is configured for deployment and will not work when trying to run locally. To run this project locally please clone the demo branch.

---

## 🧪 Usage & Feature Guide

Below are example flows for each type of user in the demo setup.

### 👩‍🎓 Students

Typical flows:

- Browse events (e.g. “All Events”, “My Events”)
- Join free or paid events
- Join waitlists when events are full
- Invite other attendees to events
- Bid on resale tickets
- Open disputes for ticket / event issues
- View “My Disputes” and chat with support

### 🧑‍🤝‍🧑 Visitors

Explore events at a chosen university (e.g. “Events at Harvard”)

- Join free or paid events
- Receive event invites from others
- Join waitlists when events are full
- Open disputes if something goes wrong

### 🎤 Event Organizers

- Access organizer-only navigation links (e.g. “Create Event”, “Analytics”)
- Create and manage events
- Open disputes related to their events
- Monitor sales activity related to their tickets

### 🛡️ Admins

- Manage Users (promote/demote, delete, filter, search)
- Manage Events and their status
- Manage Disputes (see all disputes, respond in chat-style UI)
- Manage system policies

### 🧩 System Admins

- Same as admins, plus:
- Can create regular admins and other system admins

---

## 🛠️ Tech Stack

- **React (Vite)**
- **Tailwind CSS**
- **Lucide React Icons**
- **Custom Gilroy Font**
- **Dummy JSON data** for local development

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ReemaIQ/Ticketorium.git
cd Ticketorium
```

### 2. Install Dependencies

```bash

# Install dependencies for the root project (if any)
npm install

# Install backend dependencies
cd ticketorium-frontend-backend
npm install

# Install frontend dependencies
cd ../ticketorium-frontend
npm install
```
### 3. Run the Development Server
#### Start the Backend:
```bash

# From the root directory:
cd ticketorium-frontend-backend
node server.js

# The backend will typically run on http://localhost:3001
```

#### Start the Frontend
```bash

# From the root directory:
cd ticketorium-frontend

npm run dev
# The frontend will typically run on http://localhost:5173
```

---

## 📁 Project Structure

```
ticketorium/
│
├── ticketorium-backend/      ← Node.js backend (Express server)
│     └── server.js
│
├── ticketorium/              ← React (Vite) frontend
│   ├── src/
│   │   ├── api/              ← API helper file
│   │   ├── assets/           ← Images, icons, fonts
│   │   ├── components/       ← Reusable UI components
│   │   ├── pages/            ← All page-level screens
│   │   ├── App.css
│   │   ├── App.jsx           ← App routing & providers
│   │   ├── index.css
│   │   └── main.jsx          ← React root entry
│   │
│   └── utils/                ← Shared utilities (formatting, helpers)
│
└── README.md                 ← Documentation
```

---

## Working with Dummy Data

For local development, the app uses dummy data for:
- Users and roles (students, visitors, organizers, admins, system admins)
- Events (states like joined, not-joined, waitlist, invited, etc.)
- Disputes and chat history

You can:
- Add or modify user entries to test different roles
- Change event states to see how the UI reacts
- Seed disputes with example messages to test the chat interface

### Example: Users
```bash
{
"yo-shayma": {
"first-name": "Shayma",
"last-name": "Alarfaj",
"email": "shayma@gmail.com",
"type": "visitor",
"university": "harvard",
"gender": "female",
"date-of-birth": "2004-05-01"
},
"so-cool": {
"first-name": "Cool",
"last-name": "Person",
"email": "coolest-person@kfupm.edu.sa",
"type": "admin",
"university": "kfupm",
"gender": "male",
"date-of-birth": "1995-01-01"
}
}
```
### Example: Disputes

Stored per user:
```bash
{
  "d_1": {
    "title": "Ticket not received",
    "subtitle": "I bought a ticket but never received it…",
    "messages": [
      {
        "id": "m_1",
        "from": "user",
        "type": "text",
        "text": "Hello, I need help…"
      }
    ]
  }
}
```
--- 
## 👥 Team

- Alshayma Alarfaj & Lena Ashqar & Reema Al-Qahtani

---
 
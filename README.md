# 🎟️ Ticketorium

Ticketorium is a **React + Vite** web application for managing university events, ticketing, bidding, and dispute resolution.  
It supports multiple user roles and provides a fully interactive event ecosystem with a polished UI and smooth user experience.

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
npm install
```
### 3. Run the Development Server

```bash
npm run dev
```

---

## 📁 Project Structure

    src/
    |- assets/                ← images, fonts, icons
    |- components/              ← UI components (EventActions, Tickets, Navbar, etc.)
    |- pages/                 ← Full-page views (Events, Disputes, Users)
    |- App.jsx                ← App routing
    |- main.jsx               ← React root & bootstrap
    |- public/                ← Static assets


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

- Alshayma Alarfaj
- Lena Ashqar
- Reema Alqahtani

---
 
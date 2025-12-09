# 🎟️ **Ticketorium**
## _Your Seat to Every Milestone_

Ticketorium is a **full-stack academic event ticketing platform** designed to streamline the end-to-end ticketing process for universities and their communities.  
It supports complex academic event workflows—from **graduations** to **competitions**, **seminars**, and **campus experiences**—while ensuring fairness, security, and accessibility.

Built for a multi-role ecosystem (System Admins, University Admins, Organizers, Students, Visitors), Ticketorium delivers a comprehensive digital experience for **event creation**, **registration**, **seating**, **payments**, **QR ticket validation**, **resale/bidding**, **disputes**, and **analytics**.

---

# 🌟 **Overview**

Ticketorium mirrors real academic structures. Each role has a tailored experience:

### 👩‍🎓 Students

- Browse events (e.g. “All Events”, “My Events”)
- Join free or paid events
- Join waitlists when events are full
- Invite other attendees to events
- List a ticket for bidding
- Bid on resale tickets
- Open disputes for ticket / event issues
- View “My Disputes” and chat with support

### 🧑‍🤝‍🧑 Visitors

Explore events at a chosen university (e.g. “Events at KFUPM”)

- Join free or paid events
- Receive event invites from others
- Join waitlists when events are full
- Open disputes if something goes wrong

### 🎤 Event Organizers

- Access organizer-only navigation links (e.g. “Create Event”, “Analytics”)
- Create, edit, and manage events
- Open disputes related to their events
- Monitor sales activity related to their tickets
- View analytics 

### 🛡️ Admins

- Manage Users (promote/demote, delete, filter, search)
- Manage Events and their status
- Manage Disputes (see all disputes, respond in chat-style UI)
- Manage system policies

### 🧩 System Admins

- Same as admins, plus:
- Can create regular admins and other system admins


Ticketorium replaces scattered manual processes with a **centralized**, **reliable**, and **secure** event management system.

---

# 🎫 **Core Features**

## 🔐 **Authentication & Role-Based Access Control**
- Secure JWT auth  
- Passwords stored with **bcrypt hashing**  
- Route protection per role  
- System Admin & University Admin dashboards  

---

## 🏫 **University Lifecycle**
- System Admins add universities to Ticketorium  
- University Admins add/manage:
  - Students
  - Organizers
  - University settings
- Role promotions/demotions  
- University-wide event visibility  

---

## 🎤 **Event Creation & Management**
Organizers can:

- Create and publish events  
- Configure:
  - Free or paid events  
  - Seating plans or general admission  
  - Capacity limits  
  - Event visibility  
- Edit event details anytime  
- View upcoming, active, and past events
- View general analytics
- View analytics per event

---

## 💺 **Ticketing System**
### ✔ Free & Paid Events  
- Stripe integration for payments  
- Auto seat assignment (if no seating map)  
- Registrations stored securely  

### ✔ Seating Plans  
- Organizers set structured seat maps  
- Students select seats when enabled  

### ✔ Waitlist  
- Notifications triggered  

### ✔ Invitations  
- Students & visitors can invite others  
- Accept/decline flows  

---

## 🧾 **Ticket Resale, Listings, & Bidding**
Built especially for **graduation tickets**:

- Users can create resale **listings**  
- Others can **bid** on available listings  
- Sellers choose top bids  
- Fully integrated with event details & user accounts  

---

## 📱 **Ticket Verification**
Event Organizers can validate tickets via:

- **QR Code Scanning**  
- **Ticket Code Lookup**  

Ensures secure entry and prevents fraudulent access.

---

## 🔔 **Notifications**
Real-time notifications for:

- Waitlist promotion  
- Invite requests  
- Accepted/declined invites  
- Bid offers & bid acceptance  
- Ticket purchased / transferred  
- System alerts & dispute updates  

---

## 🛟 **Disputes & Support System**
All users can open disputes regarding:

- Tickets  
- Payments  
- Event issues  
- Resale/bidding conflicts  

Admins handle disputes in a **chat-style interface** with full history and resolution tracking.

---

# 📊 **Organizer Analytics**
Professional-level dashboards with:

- **Total Events Created**  
- **Events Happening Soon**  
- **Total Attendees Across All Events**  
- **Conversion Rate (Views → Joined)**  
- Event-level charts for:
  - Attendance breakdown  
  - Joined vs Waitlisted vs Cancelled  
  - Visitor funnel  
  - Gender distribution  
  - Age groups  
  - University distribution  


---

# 🛠️ **Tech Stack**

### **Frontend**
- React + Vite  
- Tailwind CSS  
- Lucide Icons  
- QR Rendering  
- Modern component architecture  

### **Backend**
- Node.js + Express  
- MongoDB + Mongoose  
- Stripe Payments  
- JWT Authentication  
- Role-based authorization  
- QR utilities  
- Analytics aggregation  

### **Deployment**
- **Backend:** Render  
- **Frontend:** Vercel  
- Environment variables configured separately per service  

---

# 🗄️ **Architecture Overview**

```
┌───────────────────────────────────┐
│            System Admin           │
│  - Policies, Global Config        │
│  - Universities                   │
└───────────────────────────────────┘
                 │
                 ▼
┌───────────────────────────────────┐
│          University Admin         │
│ - Students, Organizers, Events    │
└───────────────────────────────────┘
                 │
                 ▼
┌───────────────────────────────────┐
│           Event Organizer         │
│  - Events, Seating, Analytics     │
│  - Ticket Validation              │
└───────────────────────────────────┘
                │
       ┌────────┴────────┐
       ▼                 ▼
┌──────────────┐    ┌───────────────┐
│   Student    │    │   Visitor     │
│ Registration │    │ Join Events   │
│ Bidding      │    │ Bidding       │
│ Listing      │    │ Disputes      │
│ Invites      │    │ Invites       │
│ Disputes     │    └───────────────┘
└──────────────┘    
```
---
## 🚀 Run The Depolyment

```bash
# front-end depolyment on Vercel
https://ticketorium-frontend-417fdu2xi-reemas-projects-8e695f30.vercel.app/
```

```bash
# backend depolyment on Render
https://ticketorium.onrender.com/health
```

---

## 🚀 Getting Started Locally

### 1. Clone the Repository

```bash
git clone https://github.com/ReemaIQ/Ticketorium.git
cd Ticketorium
```

### 2. Install Dependencies

```bash

# Install backend dependencies
cd ticketorium/ticketorium-backend
npm install

# Install frontend dependencies
cd ticketorium/ticketorium-frontend
npm install
```
### 3. Run the Development Server
#### Start the Backend:
```bash

# From the root directory:
cd ticketorium/ticketorium-backend

# run the seeds to update the data
node seeds/seedAll.js

# run the server
node server.js

# The backend will typically run on http://localhost:4000
```

#### Start the Frontend
```bash

# From the root directory:
cd ticketorium/ticketorium-frontend

npm run dev
# The frontend will typically run on http://localhost:5173
```

---

## 📁 Project Structure

```
Ticketorium/
├── .idea/
├── .vercel/
├── node_modules/ 
├── ticketorium-backend/
│   ├── models/
│   ├── node_modules/ 
│   ├── routes/
│   ├── seeds/
│   ├── utils/
│   ├── .env
│   ├── database.js
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
├── ticketorium-frontend/
│   ├── .vercel/
│   ├── data/
│   ├── dist/
│   ├── node_modules/ 
│   ├── public/
│   ├── src/
│   ├── utils/
│   ├── .env
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

--- 
## 👥 Team

- Alshayma Alarfaj & Lena Ashqar & Reema Al-Qahtani

---
 

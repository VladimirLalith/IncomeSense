# 💸 IncomeSense – AI-Powered Income Planning Dashboard

**IncomeSense** is a smart, responsive web app that helps users **allocate income wisely** using intuitive planning, tracking, and visual insights. Built with a modern tech stack including **React + Vite + Tailwind**, **Node.js**, and **MongoDB**, the app is designed to offer actionable breakdowns of income across **savings**, **spending**, and **investments**.


---

## 🚀 Features

- 🔐 **User Authentication** (JWT-based login/registration)
- 📊 **Budget Planning** – Create and save salary allocation plans
- 🧮 **Real-Time Trackers** – Compare actual spending vs. planned budgets
- 📈 **Charts & Insights** – Monthly comparisons and category breakdowns
- 🗂️ **History View** – Track past financial decisions
- ☁️ **Persistent Storage** – MongoDB integration with REST API
- 🌙 **Dark Mode UI** – Clean, modern dashboard inspired by DealCircle

---

## 🛠 Tech Stack
```bash
| Frontend      | Backend         | Database | Deployment  |
|---------------|------------------|----------|-------------|
| React (Vite)  | Node.js + Express | MongoDB  | Vercel + Render |
| TypeScript    | RESTful API       | Mongoose |             |
| Tailwind CSS  | JWT Auth          |          |             |
```
---

## 📁 Folder Structure
``` bash
IncomeSense/
├── client/ # React + Vite frontend
│ ├── src/
│ │ ├── api/ # Axios API calls (auth + transactions)
│ │ ├── auth/ # AuthContext and hooks
│ │ ├── pages/ # Home, Plan, Tracker, Login, etc.
│ │ └── components/ # UI widgets and reusable components
│ └── index.html
│
├── server/ # Node.js + Express backend
│ ├── routes/ # API routes (auth, transactions)
│ ├── models/ # Mongoose models
│ ├── controllers/ # Logic for auth and transaction handling
│ └── config/ # MongoDB connection setup
│
└── README.md
```

---

## 🔧 Local Development

### 1. Clone the repo

```bash
git clone https://github.com/VladimirLalith/IncomeSense.git
cd IncomeSense
```

2. Set up environment variables
Create .env files for both frontend and backend:

client/.env:
```bash
VITE_API_BASE_URL=https://incomesense.onrender.com
```
server/.env:
```bash
PORT=5000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
```
3. Install dependencies
```bash
# In root/client
cd client
npm install

# In root/server
cd ../server
npm install
```
4. Run locally
```bash

# Start backend (port 5000)
npm run dev

# Start frontend (port 5173)
cd ../client
npm run dev
```
🌐 Live Demo
Frontend: https://incomesense-vladimirlalith.vercel.app

Backend: https://incomesense.onrender.com

⚠️ Initial Render backend load may take 20–30s due to cold start.

🔒 Authentication
JWT tokens are issued upon login and stored in localStorage. They are used in all secured API calls (e.g. transactions).

📌 Future Enhancements
✅ Google OAuth login

📅 Recurring income/expense support

📤 Export to CSV/PDF

📱 Mobile-first PWA

🧠 AI-powered recommendations (planned)

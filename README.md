# 🅿️ MCD Smart Parking System 2.0

> **Next-Generation Urban Mobility Platform** for the Municipal Corporation of Delhi.
> A comprehensive, real-time solution for managing city-wide parking infrastructure, enforcement, and citizen services.

---

## 🏗️ Project Architecture

This project is built as a modern **Monorepo** containing both the client-side application and the server-side API.

### **Frontend (Client)**
*   **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) (Build Tool)
*   **Language**: TypeScript (Strict Mode)
*   **Styling**: [TailwindCSS](https://tailwindcss.com/) (Utility-first CSS) + Custom "Tactical" Design System
*   **Maps & Geolocation**: [React-Leaflet](https://react-leaflet.js.org/) + OpenStreetMap + Browser Geolocation API
*   **Data Visualization**: [Recharts](https://recharts.org/) (Responsive Charts)
*   **Icons**: [Lucide-React](https://lucide.dev/)
*   **Routing**: Single Page Application (SPA) with custom navigation logic.

### **Backend (Server)**
*   **Runtime**: [Node.js](https://nodejs.org/)
*   **Framework**: [Express.js](https://expressjs.com/)
*   **Real-time Engine**: [Socket.IO](https://socket.io/) (Planned for live WebSocket updates)
*   **API Structure**: RESTful API endpoints for Dashboard, Zones, Violations, and Auth.
*   **Mock Data**: Intelligent mock data generators for simulating a live production environment.

---

## 🚀 Key Modules & Features

### 1. 📱 **Citizen Portal (User App)**
*   **Live Geolocation**: Automatically detects user location and calculates the nearest parking zone.
*   **Smart Routing**: Draws a dynamic route (dashed blue line) from user to the recommendation.
*   **Booking Wizard**: 3-Step process to select zone, duration, and vehicle.
*   **Profile Management**:
    *   **My Vehicles**: Add/Remove cars and bikes (persisted locally).
    *   **Payment Methods**: Manage UPI/Cards.
    *   **History**: View past parking sessions.

### 2. 🖥️ **Command Center (Admin Dashboard)**
*   **Live KPIs**: Real-time tracking of Efficiency, Revenue, Active Flow, and System Uptime.
*   **Infrastructure Load**: Interactive Area Chart showing demand over 24h/7d.
*   **Live Zone Status**: Sidebar with real-time occupancy percentages.
*   **Notifications**: Interactive header alerts for critical system events.

### 3. 🚓 **Enforcement Suite**
*   **Violation Tracking**: List of active parking violations (Overstay, Wrong Zone).
*   **Team Deployment**: One-click "Deploy Team" action to dispatch units to a violation site.
*   **Filters**: Advanced filtering by Zone, Status, and Severity.

### 4. 🛡️ **Security Ledger**
*   **Immutable Audit Log**: A blockchain-inspired ledger recording every system action (System Boot, Zone Lock, Deployment).
*   **Real-time Updates**: New logs appear automatically as events occur in the system.
*   **Export Capability**: Download the full audit trail as a `.csv` report.

### 5. 👷 **Vendor Dashboard**
*   **QR Scanner Interface**: Simulated camera view for verifying bookings.
*   **Check-in/Check-out**: Fast processing of vehicles at entry/exit points.

---

## 🛠️ Setup & Installation

### Prerequisites
*   Node.js (v18+)
*   npm (v9+)

### Running Locally

```bash
# 1. Clone the repository
git clone https://github.com/itzdevilsunny/smart-parking-system.git
cd smart-parking-system

# 2. Install Dependencies (Root)
npm install

# 3. Start Backend
cd backend
npm install
npm run dev
# Server runs on http://localhost:5000

# 4. Start Frontend (New Terminal)
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

## 🌐 Deployment (Vercel)

1.  Push code to GitHub.
2.  Import project to Vercel.
3.  **Crucial Step**: Set **Root Directory** to `frontend` in Vercel Project Settings.
4.  Deploy!

---

## 🤝 Key Contributors

*   **Developers**: Team Smart Parking (Bit-by-Bit)
*   **Organization**: MCD Innovation Cell

---

> "Smart Parking for a Smarter Delhi."

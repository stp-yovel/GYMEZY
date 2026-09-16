# GYMEZY — Next-Gen Fitness Access and Gym Management Platform

[![Flutter](https://img.shields.io/badge/Flutter-3.x-02569B?style=for-the-badge&logo=flutter&logoColor=white)](https://flutter.dev)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Ant Design](https://img.shields.io/badge/Ant_Design-6.x-0170FE?style=for-the-badge&logo=antdesign&logoColor=white)](https://ant.design)

**GYMEZY** is a unified multi-platform fitness ecosystem that connects fitness seekers with gyms, boutique fitness studios (Yoga, Zumba, HIIT, CrossFit, Boxing), and certified personal trainers. It eliminates rigid annual contracts by providing pay-as-you-go single-session passes, flexible multi-day packages, tiered memberships with trainer add-ons, and secure digital QR/OTP access control.

---

## Quick Navigation and Documentation Links

* [Comprehensive System & DB Architecture Documentation](PROJECT_DOCUMENTATION_AND_DB_ARCHITECTURE.md)  
  *(Full ER diagrams, MongoDB collections, indexing strategy, state machines, API contracts, and security specs)*
* [Mobile Application (User App)](Mobile%20Application/user)
* [Web Application (Portal)](Web%20Application)
* [Middleware API (Backend)](middleware)

---

## Monorepo Structure

```text
GYMEZY/
├── Mobile Application/
│   ├── user/                     # Flutter User App (iOS, Android, Web)
│   │   ├── lib/
│   │   │   ├── data/             # Repositories and Mock Data
│   │   │   ├── models/           # Domain Models (Gym, BookingItem, MembershipItem, Trainer)
│   │   │   ├── pages/            # 13+ Screens (Discovery, Booking, Passes, Profile, etc.)
│   │   │   ├── theme/            # Centralized Theme, Dark/Light Mode and Tokens
│   │   │   ├── widgets/          # Custom Calendar, QR Pass Card, Dialogs
│   │   │   └── main.dart         # Flutter App Entry Point
│   │   └── pubspec.yaml          # Flutter Dependencies
│   └── gym owner/                # Flutter Gym Owner and Front-Desk Scanner App
│
├── Web Application/              # React 19 + Vite Web Application and Landing Page
│   ├── src/
│   │   ├── pages/                # Landing Page and Dashboard Pages
│   │   ├── App.jsx               # Root React Component
│   │   └── main.jsx              # React Entry Point
│   ├── package.json              # Web App Dependencies (Ant Design, Axios)
│   └── vite.config.js            # Vite Build Configuration
│
├── middleware/                   # Node.js + Express REST API Backend
│   ├── server.js                 # Express Application and MongoDB Mongoose Gateway
│   ├── package.json              # Backend Dependencies (Express, Mongoose, Helmet, Morgan)
│   └── .env                      # Server Environment Variables (PORT, MONGODB_URI)
│
├── PROJECT_DOCUMENTATION_AND_DB_ARCHITECTURE.md # Master System & DB Architecture Reference
└── README.md                     # Master Project README
```

---

## Technology Stack

| Layer | Technologies | Description |
| :--- | :--- | :--- |
| **Mobile App (User)** | Flutter 3.x, Dart 3.x, Google Fonts (`Outfit`), Flutter Animate, QR Flutter | Cross-platform native mobile experience for gym discovery, booking, and digital passes. |
| **Web Portal** | React 19, Vite, Ant Design (`antd 6.x`), Axios | Modern, responsive web platform for onboarding and management. |
| **Backend API** | Node.js 20+, Express.js, Helmet, Morgan, CORS | Scalable REST API gateway handling business logic and auth. |
| **Database** | MongoDB Atlas, Mongoose ODM, 2dsphere GeoJSON | Geo-spatial indexing for location queries and flexible document storage. |
| **Security & Access** | JWT Auth, HMAC-SHA256 Dynamic QR Codes, 6-Digit OTPs | Contactless access control and anti-passback verification. |

---

## Getting Started and Local Development

### 1. Prerequisites
Ensure you have the following installed on your machine:
* **Flutter SDK** (`>= 3.0.0`) & Xcode / Android Studio
* **Node.js** (`>= 18.x.x` or `20.x.x`) & `npm`
* **Git**
* **MongoDB** (Local instance or MongoDB Atlas cluster connection string)

---

### 2. Backend Middleware Setup

1. Open your terminal and navigate to the `middleware` directory:
   ```bash
   cd middleware
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Configure the `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/gymezy?retryWrites=true&w=majority
   ```
4. Start the server:
   ```bash
   npm start
   # or with nodemon for live reload:
   npx nodemon server.js
   ```
   *The server runs at `http://localhost:5000`.*

---

### 3. Mobile User Application (Flutter) Setup

1. Open a new terminal tab and navigate to the user mobile app directory:
   ```bash
   cd "Mobile Application/user"
   ```
2. Fetch Flutter packages:
   ```bash
   flutter pub get
   ```
3. Run on your simulator, emulator, or connected physical device:
   ```bash
   # Run on default connected device
   flutter run

   # Or run specifically on Chrome / macOS / iOS Simulator / Android
   flutter run -d chrome
   flutter run -d ios
   flutter run -d android
   ```

> **Demo Login Credentials:**
> - **Email:** `sam@gmail.com`
> - **Password:** `123456`
> - *(Or tap the "Auto-Fill Demo" button on the Login Screen)*

---

### 4. Web Application (React + Vite) Setup

1. Open a new terminal tab and navigate to the web application directory:
   ```bash
   cd "Web Application"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser at `http://localhost:5173`.

---

## Key Application Features

* **Intelligent Geo-Discovery:** Find gyms and studios in real time sorted by distance, ratings, price, and specialized workout tags (`HIIT`, `Yoga`, `Strength`, `Boxing`, `CrossFit`, `Women Only`).
* **Multi-Mode Bookings:** 
  - **Single Session Pass:** Pay only for the day you work out.
  - **Weekly Pass:** 7-day unlimited access.
  - **Custom Multi-Dates:** Flexible batch selection.
  - **Group Studio Classes:** Yoga, Zumba, HIIT time slot reservations.
* **Tiered Memberships:** 1 Month, 3 Months, 6 Months, and 12 Months plans with instant savings calculation.
* **Personal Trainer Integration:** Select certified trainers based on specialty (e.g. Weight Loss, Muscle Hypertrophy) with customized day schedules (e.g. Mon/Wed/Fri 5 PM).
* **Digital QR Pass and OTP Access:** High-contrast digital pass screen with full-screen dynamic QR code and backup 6-digit OTP for contactless check-in.
* **Rescheduling and Instant Refund Cancellation:** Reschedule session dates or cancel with instant policy checks and automated refund processing.
* **Fitness Health Metrics:** Track height, weight, BMI categorization, target weight, emergency contacts, and workout reminders.

---

## Security and Data Integrity

* **Anti-Passback Protection:** Dynamic QR payloads refresh periodically to prevent pass-sharing via screenshots.
* **Geo-Spatial Query Optimizations:** High-performance `$nearSphere` queries powered by MongoDB `2dsphere` indexes.
* **Secure Storage:** Biometric local authentication support for streamlined user logins.

---

## Engineering and Contributions

1. Clone the repository: `git clone https://github.com/your-org/GYMEZY.git`
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m "feat: add amazing feature"`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request.

---

*GYMEZY — Empowering fitness without boundaries.*

# GYMEZY Platform — Comprehensive Industry Specification & Database Architecture Document

> **Document Version:** 1.0.0  
> **Target Systems:** Mobile (Flutter - User & Gym Owner), Backend Middleware (Node.js/Express/MongoDB), Web Portal (React/Vite)  
> **Status:** Production-Ready Architectural Reference  

---

## Table of Contents
1. [Executive Summary & Product Concept](#1-executive-summary--product-concept)
2. [High-Level System Architecture](#2-high-level-system-architecture)
3. [Database Architecture & Data Models (DB Architecture)](#3-database-architecture--data-models-db-architecture)
   - 3.1 [Entity-Relationship Diagram (ERD)](#31-entity-relationship-diagram-erd)
   - 3.2 [Schema Specifications & Data Dictionaries](#32-schema-specifications--data-dictionaries)
   - 3.3 [Database Indexing & Optimization Strategy](#33-database-indexing--optimization-strategy)
4. [Detailed System & User Workflows](#4-detailed-system--user-workflows)
   - 4.1 [User Authentication & Profile Initialization](#41-user-authentication--profile-initialization)
   - 4.2 [Gym Discovery & Geo-Spatial Search](#42-gym-discovery--geo-spatial-search)
   - 4.3 [Pay-Per-Session & Multi-Day Class Booking Lifecycle](#43-pay-per-session--multi-day-class-booking-lifecycle)
   - 4.4 [Tiered Membership & Personal Trainer Addon Workflow](#44-tiered-membership--personal-trainer-addon-workflow)
   - 4.5 [Digital QR Pass Access Control & Check-in Verification](#45-digital-qr-pass-access-control--check-in-verification)
   - 4.6 [Rescheduling, Cancellation & Refund Lifecycle](#46-rescheduling-cancellation--refund-lifecycle)
5. [State Machine Architecture](#5-state-machine-architecture)
6. [API Architecture & RESTful Endpoint Contracts](#6-api-architecture--restful-endpoint-contracts)
7. [Non-Functional Requirements, Security & Scalability](#7-non-functional-requirements-security--scalability)
8. [Platform System Accounts & Initial Seed Credentials](#8-platform-system-accounts--initial-seed-credentials)
9. [Feature Specifications & Architecture Plans (October 2026 Releases)](#9-feature-specifications--architecture-plans-october-2026-releases)
   - 9.1 [Location-Aware Banners & Geo-Targeted Promotion System](#91-location-aware-banners--geo-targeted-promotion-system)
   - 9.2 [Single Source of Truth (SSOT) Gym Operating Hours & Dynamic Slot Engine](#92-single-source-of-truth-ssot-gym-operating-hours--dynamic-slot-engine)
   - 9.3 [Per-Session Booking & Trainer Add-on Architecture](#93-per-session-booking--trainer-add-on-architecture)
   - 9.4 [Section Batch Scheduling, Turnstile QR Check-in & Auto Check-Out](#94-section-batch-scheduling-turnstile-qr-check-in--auto-check-out)
   - 9.5 [Part-Time & Temporary Staff Management Module](#95-part-time--temporary-staff-management-module)
   - 9.6 [Strict Trainer Schedule Enforcement Across Bookings & Membership Tiers](#96-strict-trainer-schedule-enforcement-across-bookings--membership-tiers)

---

## 1. Executive Summary & Product Concept

**GYMEZY** is a next-generation fitness-tech ecosystem designed to democratize fitness facility access. It bridges fitness enthusiasts with certified gyms, specialized fitness studios (Yoga, Zumba, HIIT, CrossFit, Boxing), and certified personal trainers without locking users into restrictive long-term commitments.

### Core Value Pillars
1. **Pay-As-You-Go Flexibility:** Single-session passes, 5-day batches, and weekly passes for gym floor workouts and studio classes.
2. **Tiered Long-Term Memberships:** 30-day (Monthly), 90-day (Quarterly), 180-day (Half-Yearly), and 365-day (Annual) packages with clear savings calculation.
3. **Personal Training Integration:** Real-time trainer matching based on fitness goals (Weight Loss, Hypertrophy, Strength, HIIT) with schedule synchronization.
4. **Contactless Access Control:** Tamper-proof, cryptographically signed dynamic QR passes paired with 6-digit fallback OTPs for check-in verification at gym turnstiles and front desks.
5. **Holistic Fitness Profile:** BMI analytics, body metrics tracking, custom workout reminders, and attendance history.

---

## 2. High-Level System Architecture

```mermaid
flowchart TB
    subgraph Client_Layer ["Client Presentation Tier"]
        UA["Flutter User App (iOS / Android)"]
        OA["Flutter Gym Owner App"]
        WA["React Admin & Gym Web Dashboard"]
    end

    subgraph Gateway_Layer ["API Gateway & Security Tier"]
        GW["API Gateway / Reverse Proxy (Nginx)"]
        AUTH["JWT / OAuth2 / Biometric Token Validator"]
        RL["Rate Limiter & Helmet Protection"]
    end

    subgraph Service_Layer ["Microservices / Application Middleware Tier"]
        USVC["User & Profile Service"]
        GSVC["Gym & Discovery Service"]
        BSVC["Booking & Slot Allocation Engine"]
        MSVC["Membership & Subscription Service"]
        PSVC["Payment & Invoicing Gateway Adapter"]
        ASVC["Access Control & QR/OTP Engine"]
        NSVC["Push Notification & SMS Service (FCM/Twilio)"]
    end

    subgraph Persistence_Layer ["Data & Cache Storage Tier"]
        MDB[("MongoDB Cluster (Primary Document DB)")]
        REDIS[("Redis Cache & Distributed Lock Manager")]
        MEDIA[("Cloudinary / Server Media Storage (Photos & Assets)")]
    end

    UA -->|HTTPS / WSS| GW
    OA -->|HTTPS / WSS| GW
    WA -->|HTTPS| GW

    GW --> AUTH --> RL
    RL --> USVC & GSVC & BSVC & MSVC & PSVC & ASVC & NSVC

    USVC & GSVC & BSVC & MSVC & PSVC & ASVC --> MDB
    BSVC & ASVC --> REDIS
    USVC & GSVC --> MEDIA
```

---

## 3. Database Architecture & Data Models (DB Architecture)

### 3.1 Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o{ BOOKINGS : "places"
    USERS ||--o{ MEMBERSHIPS : "subscribes"
    USERS ||--o{ REVIEWS : "writes"
    USERS ||--o{ CHECKIN_LOGS : "logs"
    
    GYMS ||--o{ TRAINERS : "employs"
    GYMS ||--o{ CLASS_TYPES : "hosts"
    GYMS ||--o{ TIME_SLOTS : "schedules"
    GYMS ||--o{ BOOKINGS : "fulfills"
    GYMS ||--o{ MEMBERSHIPS : "honors"
    GYMS ||--o{ REVIEWS : "receives"
    GYMS ||--o{ CHECKIN_LOGS : "verifies"

    TRAINERS ||--o{ MEMBERSHIPS : "assigned_to"
    TRAINERS ||--o{ TIME_SLOTS : "conducts"

    BOOKINGS ||--|| PAYMENTS : "billed_under"
    BOOKINGS ||--o{ CHECKIN_LOGS : "authorizes"

    MEMBERSHIPS ||--|| PAYMENTS : "billed_under"
    MEMBERSHIPS ||--o{ CHECKIN_LOGS : "authorizes"

    USERS {
        ObjectId _id PK
        string full_name
        string email
        string phone
        string gender
        string emergency_contact
        string avatar_url
        double height_cm
        double weight_kg
        double target_weight_kg
        string fitness_goal
        boolean biometric_enabled
        timestamp created_at
    }

    GYMS {
        ObjectId _id PK
        string name
        string slug
        geo_point location
        string full_address
        string city
        double rating
        int reviews_count
        double price_per_session
        array facilities
        array amenities
        array workouts
        array rules
        array safety_measures
        string opening_hours
        boolean is_active
    }

    TRAINERS {
        ObjectId _id PK
        ObjectId gym_id FK
        string name
        string image_url
        int experience_years
        string specialty
        double rating
        int reviews_count
        double monthly_rate
        boolean is_available
    }

    BOOKINGS {
        ObjectId _id PK
        string booking_reference UK
        ObjectId user_id FK
        ObjectId gym_id FK
        string booking_type
        string session_title
        date start_date
        date end_date
        string time_slot
        int total_sessions
        double amount_paid
        string otp_code
        string qr_token
        string status
        string cancellation_reason
    }

    MEMBERSHIPS {
        ObjectId _id PK
        string membership_reference UK
        ObjectId user_id FK
        ObjectId gym_id FK
        ObjectId trainer_id FK
        string plan_name
        int duration_days
        date start_date
        date end_date
        double base_amount
        double trainer_fee
        double total_amount
        string otp_code
        string qr_token
        string status
        boolean has_personal_trainer
    }

    PAYMENTS {
        ObjectId _id PK
        string transaction_id UK
        string reference_type
        ObjectId reference_id FK
        ObjectId user_id FK
        double subtotal
        double tax_amount
        double discount_amount
        double final_amount
        string payment_gateway
        string payment_mode
        string status
        timestamp paid_at
    }

    CHECKIN_LOGS {
        ObjectId _id PK
        ObjectId gym_id FK
        ObjectId user_id FK
        string pass_type
        ObjectId pass_id FK
        string verification_method
        string verified_by
        timestamp checkin_time
    }

    REVIEWS {
        ObjectId _id PK
        ObjectId gym_id FK
        ObjectId user_id FK
        double rating
        string booking_type
        string comment
        timestamp created_at
    }
```

---

### 3.2 Schema Specifications & Data Dictionaries

#### 1. `users` Collection
Stores user identity, authentication metadata, biometric preferences, and dynamic health/fitness metrics.

```json
{
  "_id": { "$type": "objectId" },
  "full_name": { "$type": "string" },
  "email": { "$type": "string" },
  "phone": { "$type": "string" },
  "password_hash": { "$type": "string" },
  "gender": { "$type": "string", "enum": ["Male", "Female", "Other", "Prefer not to say"] },
  "avatar_url": { "$type": "string" },
  "emergency_contact": {
    "name": { "$type": "string" },
    "phone": { "$type": "string" },
    "relationship": { "$type": "string" }
  },
  "fitness_metrics": {
    "height_cm": { "$type": "double" },
    "weight_kg": { "$type": "double" },
    "target_weight_kg": { "$type": "double" },
    "bmi": { "$type": "double" },
    "bmi_category": { "$type": "string" },
    "primary_goal": { "$type": "string" }
  },
  "preferences": {
    "workout_reminders": { "$type": "bool", "default": true },
    "pass_expiry_alerts": { "$type": "bool", "default": true },
    "biometric_login": { "$type": "bool", "default": false },
    "saved_gym_bookmarks": [{ "$type": "objectId" }]
  },
  "created_at": { "$type": "date" },
  "updated_at": { "$type": "date" }
}
```

#### 2. `gyms` Collection
Stores fitness center profiles, geo-spatial coordinates, amenity lists, rules, and pricing baselines.

```json
{
  "_id": { "$type": "objectId" },
  "name": { "$type": "string" },
  "slug": { "$type": "string" },
  "location": {
    "type": { "$type": "string", "enum": ["Point"], "default": "Point" },
    "coordinates": [{ "$type": "double" }, { "$type": "double" }] // [longitude, latitude]
  },
  "area": { "$type": "string" },
  "city": { "$type": "string" },
  "full_address": { "$type": "string" },
  "pincode": { "$type": "string" },
  "images": [{ "$type": "string" }],
  "rating": { "$type": "double", "default": 0.0 },
  "reviews_count": { "$type": "int", "default": 0 },
  "price_per_session": { "$type": "double" },
  "tags": [{ "$type": "string" }],
  "badge_text": { "$type": "string" },
  "about_text": { "$type": "string" },
  "opening_hours": {
    "open_time": { "$type": "string" },
    "close_time": { "$type": "string" },
    "displayText": { "$type": "string" }
  },
  "facilities": [{ "$type": "string" }],
  "amenities": [{ "$type": "string" }],
  "workouts": [{ "$type": "string" }],
  "rules": [{ "$type": "string" }],
  "safety_measures": [{ "$type": "string" }],
  "is_active": { "$type": "bool", "default": true },
  "created_at": { "$type": "date" },
  "updated_at": { "$type": "date" }
}
```

#### 3. `trainers` Collection
Represents fitness coaches, their master specialties, credentials, schedules, and fee structures.

```json
{
  "_id": { "$type": "objectId" },
  "gym_id": { "$type": "objectId" },
  "name": { "$type": "string" },
  "image_url": { "$type": "string" },
  "experience_years": { "$type": "int" },
  "specialty": { "$type": "string" },
  "bio": { "$type": "string" },
  "rating": { "$type": "double" },
  "reviews_count": { "$type": "int" },
  "monthly_addon_fee": { "$type": "double" },
  "available_slots": [
    {
      "day_pattern": { "$type": "string" }, // e.g. "Mon, Wed, Fri"
      "start_time": { "$type": "string" },
      "end_time": { "$type": "string" },
      "max_clients": { "$type": "int", "default": 5 }
    }
  ],
  "is_active": { "$type": "bool", "default": true }
}
```

#### 4. `bookings` Collection
Covers on-demand session bookings, weekly unlimited passes, and multi-day class batches (Yoga, Zumba, HIIT, etc.).

```json
{
  "_id": { "$type": "objectId" },
  "booking_reference": { "$type": "string" }, // e.g., "FSB123456"
  "user_id": { "$type": "objectId" },
  "customer_id": { "$type": "string" },
  "gym_id": { "$type": "objectId" },
  "category": { "$type": "string", "enum": ["Gym", "Yoga", "Zumba", "HIIT", "CrossFit", "Boxing"] },
  "booking_type": { "$type": "string", "enum": ["Per Session", "Weekly Plan", "Custom Dates", "Group Class"] },
  "session_subtitle": { "$type": "string" },
  "dates": [{ "$type": "date" }],
  "start_date": { "$type": "date" },
  "end_date": { "$type": "date" },
  "time_slot": { "$type": "string" },
  "days_booked_label": { "$type": "string" },
  "amount_paid": { "$type": "double" },
  "payment_id": { "$type": "objectId" },
  "payment_mode": { "$type": "string", "enum": ["UPI", "Card", "NetBanking", "Wallet"] },
  "otp": { "$type": "string" }, // 6-digit OTP
  "qr_hash": { "$type": "string" }, // Encrypted payload for QR code scanner
  "status": { "$type": "string", "enum": ["Upcoming", "Active", "Completed", "Cancelled", "Rescheduled"] },
  "cancellation_reason": { "$type": "string" },
  "cancellation_timestamp": { "$type": "date" },
  "created_at": { "$type": "date" },
  "updated_at": { "$type": "date" }
}
```

#### 5. `memberships` Collection
Covers long-term subscription tiers with optional personal trainer add-ons.

```json
{
  "_id": { "$type": "objectId" },
  "membership_reference": { "$type": "string" }, // e.g., "MBR123456"
  "user_id": { "$type": "objectId" },
  "customer_id": { "$type": "string" },
  "gym_id": { "$type": "objectId" },
  "plan_name": { "$type": "string", "enum": ["Monthly", "Quarterly", "Half Yearly", "Annual"] },
  "duration_days": { "$type": "int" },
  "start_date": { "$type": "date" },
  "end_date": { "$type": "date" },
  "base_amount": { "$type": "double" },
  "has_personal_trainer": { "$type": "bool" },
  "trainer_id": { "$type": "objectId" },
  "trainer_name": { "$type": "string" },
  "trainer_specialty": { "$type": "string" },
  "trainer_schedule": { "$type": "string" },
  "trainer_fee": { "$type": "double" },
  "total_amount_paid": { "$type": "double" },
  "payment_id": { "$type": "objectId" },
  "payment_mode": { "$type": "string" },
  "otp": { "$type": "string" },
  "qr_hash": { "$type": "string" },
  "status": { "$type": "string", "enum": ["Active", "Expiring Soon", "Expired", "Cancelled", "Paused"] },
  "created_at": { "$type": "date" },
  "updated_at": { "$type": "date" }
}
```

#### 6. `payments` Collection
Stores full transaction histories, invoice breakdowns, payment gateway IDs, and refund traces.

```json
{
  "_id": { "$type": "objectId" },
  "transaction_id": { "$type": "string" }, // e.g., "TXN_987654321"
  "order_id": { "$type": "string" },
  "user_id": { "$type": "objectId" },
  "reference_type": { "$type": "string", "enum": ["Booking", "Membership"] },
  "reference_id": { "$type": "objectId" },
  "subtotal": { "$type": "double" },
  "convenience_fee": { "$type": "double" },
  "tax_amount": { "$type": "double" },
  "discount_amount": { "$type": "double" },
  "total_amount": { "$type": "double" },
  "currency": { "$type": "string", "default": "INR" },
  "payment_gateway": { "$type": "string", "enum": ["Razorpay", "Stripe", "Cashfree"] },
  "gateway_payment_id": { "$type": "string" },
  "payment_mode": { "$type": "string" },
  "status": { "$type": "string", "enum": ["Pending", "Captured", "Failed", "Refunded"] },
  "refund_details": {
    "refund_id": { "$type": "string" },
    "amount": { "$type": "double" },
    "status": { "$type": "string" },
    "initiated_at": { "$type": "date" }
  },
  "created_at": { "$type": "date" }
}
```

#### 7. `checkin_logs` Collection
Audit trail for access control, physical presence tracking, and scanner device logging.

```json
{
  "_id": { "$type": "objectId" },
  "gym_id": { "$type": "objectId" },
  "user_id": { "$type": "objectId" },
  "pass_type": { "$type": "string", "enum": ["Booking", "Membership"] },
  "pass_id": { "$type": "objectId" },
  "reference_code": { "$type": "string" },
  "verification_method": { "$type": "string", "enum": ["QR_SCAN", "MANUAL_OTP"] },
  "verified_by_device_id": { "$type": "string" },
  "timestamp": { "$type": "date" },
  "status": { "$type": "string", "enum": ["Granted", "Denied", "Expired", "Duplicate"] }
}
```

---

### 3.3 Database Indexing & Optimization Strategy

| Collection | Index Fields | Type | Purpose |
| :--- | :--- | :--- | :--- |
| `gyms` | `{ "location": "2dsphere" }` | Geospatial | Real-time proximity search (`$nearSphere` / `$geoWithin`) |
| `gyms` | `{ "city": 1, "is_active": 1 }` | Compound | Fast filtering by active gyms in a city |
| `gyms` | `{ "tags": 1, "workouts": 1 }` | Multi-key | Category filter optimization |
| `users` | `{ "email": 1 }` / `{ "phone": 1 }` | Unique | Identity deduplication & fast auth lookup |
| `bookings` | `{ "booking_reference": 1 }` | Unique | O(1) Booking verification & QR lookup |
| `bookings` | `{ "user_id": 1, "status": 1, "start_date": -1 }` | Compound | Fetching user's active/upcoming bookings |
| `memberships` | `{ "user_id": 1, "status": 1, "end_date": -1 }` | Compound | Active membership resolution |
| `payments` | `{ "transaction_id": 1 }` | Unique | Payment idempotency & reconciliation |
| `checkin_logs` | `{ "gym_id": 1, "timestamp": -1 }` | Compound | Gym owner daily attendance stream |

---

## 4. Detailed System & User Workflows

### 4.1 User Authentication & Profile Initialization

```mermaid
sequenceDiagram
    autonumber
    actor User as Fitness User (Flutter App)
    participant Auth as Auth Controller
    participant DB as MongoDB (Users)
    participant Sec as Secure Storage (Keychain/Keystore)

    User->>Auth: Submit Login (Email + Password / Demo Credentials)
    Auth->>DB: Query User record by email
    DB-->>Auth: User Entity + Password Hash
    Auth->>Auth: Verify Argon2/Bcrypt hash
    Auth->>Auth: Generate JWT Access (15m) + Refresh (30d) Tokens
    Auth-->>User: Return AuthPayload + Profile Data
    User->>Sec: Store JWT & Refresh Token securely
    User->>User: Sync Biometric preferences (FaceID/Fingerprint)
```

---

### 4.2 Gym Discovery & Geo-Spatial Search

```mermaid
flowchart TD
    Start([User Opens Home Screen]) --> Loc[Detect GPS Coordinates / Selected City]
    Loc --> Query[Execute $nearSphere Query on Gyms Collection]
    Query --> FilterCheck{User Applied Filters?}
    
    FilterCheck -- Yes --> Filter["Filter by: Categories, Amenities, Workouts, Price"]
    FilterCheck -- No --> DistanceSort[Sort by Proximity & Rating]
    Filter --> DistanceSort
    
    DistanceSort --> Render[Render Gym Cards & Badges]
    Render --> Select[User Taps Gym Card]
    Select --> Detail[Load GymDetailsScreen with Facilities, Trainers, Reviews & Rules]
```

---

### 4.3 Pay-Per-Session & Multi-Day Class Booking Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant UI as BookingSessionScreen
    participant Engine as Booking Engine
    participant Lock as Redis Lock
    participant PG as Payment Gateway
    participant DB as MongoDB

    User->>UI: Select Category (Gym / Yoga / Zumba / HIIT)
    User->>UI: Select Mode (Single Session / Weekly Pass / Custom Dates)
    User->>UI: Select Time Slot (e.g. 7:00 AM) & Date(s)
    UI->>Engine: Validate Slot Capacity & Pricing
    Engine->>Lock: Acquire temporary slot lock (10 min TTL)
    UI->>User: Display Payment Summary (Subtotal + GST)
    User->>PG: Complete Payment via UPI / Card
    PG-->>Engine: Payment Captured Webhook
    Engine->>DB: Create Booking Document (Status: 'Upcoming')
    Engine->>Engine: Generate 6-Digit OTP & Signed Dynamic QR Token
    Engine->>Lock: Release slot lock & decrement permanent slot counter
    Engine-->>UI: Booking Confirmation + Digital Pass
```

---

### 4.4 Tiered Membership & Personal Trainer Addon Workflow

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant UI as BuyMembershipScreen
    participant Repo as Membership Engine
    participant DB as MongoDB

    User->>UI: Select Plan (Monthly / Quarterly / Half-Yearly / Annual)
    UI->>UI: Calculate Savings vs Base Monthly Rate
    User->>UI: Toggle "Add Personal Trainer" (Optional)
    alt Trainer Added
        UI->>DB: Fetch Gym Certified Trainers & Specialties
        DB-->>UI: Return Trainer List (Rating, Exp, Addon Fee)
        User->>UI: Select Trainer (e.g. Rohit Sharma - Weight Loss)
        User->>UI: Select Trainer Slot Schedule (Mon, Wed, Fri 5 PM)
        UI->>UI: Compute Base Plan + Trainer Fee Total
    end
    User->>UI: Select Start Date via Custom Calendar
    User->>Repo: Initiate Checkout & Payment
    Repo->>DB: Save Active Membership Document
    Repo-->>UI: Navigate to MembershipDetailsScreen with Pass & Trainer Badge
```

---

### 4.5 Digital QR Pass Access Control & Check-in Verification

```mermaid
flowchart TD
    subgraph User_App ["User Device"]
        PASS["User opens Booking or Membership Details"]
        QR_GEN["Generate Dynamic QR Code (Payload: Pass ID + Cryptographic Timestamp + Nonce)"]
        OTP_GEN["Display 6-Digit Fallback OTP"]
        PASS --> QR_GEN & OTP_GEN
    end

    subgraph Scanner_App ["Gym Turnstile / Owner App"]
        SCAN["Scanner scans QR Code"]
        MAN_OTP["Staff enters 6-Digit OTP"]
    end

    QR_GEN --> SCAN
    OTP_GEN --> MAN_OTP

    subgraph Verification_Engine ["Backend Verification Engine"]
        VER["Validate Pass Authenticity & Expiry"]
        DUP{"Already checked in today?"}
        GRANT["Access Granted (Green Light & Gate Trigger)"]
        DENY["Access Denied (Invalid / Expired / Duplicate)"]
        LOG["Write to checkin_logs Collection"]
    end

    SCAN --> VER
    MAN_OTP --> VER
    VER --> DUP
    DUP -- No --> GRANT --> LOG
    DUP -- Yes --> DENY --> LOG
```

---

### 4.6 Rescheduling, Cancellation & Refund Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant App as BookingDetailsScreen
    participant Engine as Booking Engine
    participant PG as Payment Gateway
    participant DB as MongoDB

    alt Reschedule Flow
        User->>App: Tap "Modify Booking"
        User->>App: Pick New Date & Available Time Slot
        App->>Engine: Post Reschedule Request
        Engine->>DB: Update Booking (date, time, status='Rescheduled')
        Engine-->>App: Confirmation Toast + Updated Pass
    else Cancel Flow
        User->>App: Tap "Cancel Booking"
        User->>App: Select Cancellation Reason
        App->>Engine: Post Cancellation Request
        Engine->>Engine: Verify Cancellation Window (> 2 hrs before slot)
        Engine->>DB: Update Booking Status to 'Cancelled'
        Engine->>PG: Dispatch Automated Refund to original UPI/Card
        PG-->>Engine: Refund Reference ID
        Engine->>DB: Log Refund in Payments record
        Engine-->>App: Refund Confirmation ("Refund initiated to UPI")
    end
```

---

## 5. State Machine Architecture

### Booking Lifecycle State Transition

```mermaid
stateDiagram-v2
    [*] --> Upcoming : Payment Succeeded
    Upcoming --> Active : Session Start Time Reached / QR Scanned
    Upcoming --> Rescheduled : User Modifies Slot
    Rescheduled --> Upcoming : Slot Re-confirmed
    Upcoming --> Cancelled : User Cancels before cut-off
    Active --> Completed : Check-in Verified & Session Finished
    Upcoming --> Expired : Slot Missed / No Check-in
    Cancelled --> [*]
    Completed --> [*]
    Expired --> [*]
```

### Membership Lifecycle State Transition

```mermaid
stateDiagram-v2
    [*] --> Active : Subscription Purchased
    Active --> ExpiringSoon : Remaining Days <= 7
    ExpiringSoon --> Expired : Remaining Days = 0
    Active --> Paused : User Medical Freeze Request
    Paused --> Active : Freeze Window Ends
    Active --> Cancelled : Terminated / Refunded
    ExpiringSoon --> Active : User Renews Plan
    Expired --> [*]
```

---

## 6. API Architecture & RESTful Endpoint Contracts

### 6.1 Authentication & Profile
- `POST /api/v1/auth/login` — Authenticate user via email/password or OTP.
- `POST /api/v1/auth/refresh-token` — Rotate expired access tokens.
- `GET /api/v1/users/profile` — Fetch personal details, health metrics, and BMI statistics.
- `PATCH /api/v1/users/profile` — Update emergency contacts, fitness goals, and notification preferences.

### 6.2 Gym Discovery
- `GET /api/v1/gyms` — Search gyms with query parameters: `lat`, `lng`, `radius_km`, `category`, `workout`, `facility`, `search`.
- `GET /api/v1/gyms/:gymId` — Get comprehensive gym profile, facilities, rules, reviews, and trainer rosters.
- `POST /api/v1/gyms/:gymId/bookmark` — Toggle gym bookmark status.

### 6.3 Bookings & Sessions
- `GET /api/v1/gyms/:gymId/slots` — Get available morning and evening slots for a specific date and category.
- `POST /api/v1/bookings/reserve` — Lock slot for 10 minutes prior to payment checkout.
- `POST /api/v1/bookings/confirm` — Create booking record upon payment gateway webhook confirmation.
- `GET /api/v1/bookings/my-bookings` — List user bookings filtered by `status=Upcoming|Completed|Cancelled`.
- `PATCH /api/v1/bookings/:bookingId/reschedule` — Update date and time slot.
- `POST /api/v1/bookings/:bookingId/cancel` — Cancel booking and initiate refund.

### 6.4 Memberships
- `GET /api/v1/gyms/:gymId/plans` — Fetch active membership tiers and seasonal discounts.
- `POST /api/v1/memberships/checkout` — Purchase membership with optional trainer add-on.
- `GET /api/v1/memberships/my-memberships` — Retrieve active and historical memberships.

### 6.5 Access Control & Validation (Gym Staff / Turnstile API)
- `POST /api/v1/access/verify-qr` — Decrypt and validate dynamic QR code payload.
- `POST /api/v1/access/verify-otp` — Validate 6-digit backup OTP code.

---

## 7. Non-Functional Requirements, Security & Scalability

### 7.1 Security & Access Control
- **Cryptographic QR Tokens:** Dynamic QR payloads generated using HMAC-SHA256 with a 60-second rolling validity to prevent screenshot sharing (anti-passback protection).
- **Transport Security:** Strict TLS 1.3 encryption across all client-to-gateway and gateway-to-microservice communication.
- **Biometric Security:** Local biometric tokens (FaceID/Fingerprint) unlock access without re-transmitting cleartext credentials.

### 7.2 Scalability & Concurrency
- **Distributed Slot Locking:** Redis distributed locks (`Redlock`) guarantee no two users can book the same capacity-constrained class slot simultaneously during peak rush hours.
- **Geo-Spatial Query Caching:** Frequent location-based search results cached in Redis with a 5-minute TTL.

### 7.3 High Availability & Observability
- **Database Replication:** MongoDB Replica Set with automatic failover and read-preference distribution (`primaryPreferred`).
- **Telemetry & Monitoring:** Structured Winston/Morgan logging, Prometheus metrics, and APM tracing for all booking and payment state transitions.

---

## 8. Platform System Accounts & Initial Seed Credentials

### 8.1 Default Super Admin Account

For administrative access, platform oversight, and initial database bootstrap:

| Attribute | Value / Specification |
|---|---|
| **Account Name** | `Gymezy` |
| **Email Address** | `admin@gymezy.com` |
| **Phone Number** | `+91 9150955071` / `+91 9884881983` |
| **Initial Password** | `SuperAdmin@Gymezy2026!` |
| **User Role** | `SUPER_ADMIN` |
| **Status** | `isActive: true`, `isVerified: true` |
| **Registered Office** | Second Floor, Mahalakshmi Nagar, Plot No 5, Jyothi Nagar, Moulivakkam, Kolathuvancheri, Tamil Nadu 600125 |

### 8.2 Database Seeding Command

To seed or refresh the Super Admin account in the active database cluster:

```bash
cd middleware
node src/scripts/seedSuperAdmin.js
```

---

## 9. Feature Specifications & Architecture Plans (October 2026 Releases)

### 9.1 Location-Aware Banners & Geo-Targeted Promotion System

#### Overview
The user home screen features dynamic promotion banners that adapt to the user's geographic location (city, area, and coordinates) rather than presenting a static global list.

#### Technical Implementation
- **Location Resolution:** The client passes coordinates (`lat`, `lng`) or active city name in discovery queries.
- **Radius Filtering:** Banners assigned to specific partner gyms only render if the user's location is within the gym's defined operational radius (default: 25 km).
- **Proximity Pill:** Banners display a real-time proximity badge (e.g. *1.4 km away* or *Near Anna Nagar*) calculated via the Haversine formula.
- **Fail-Safe Fallback:** If GPS permissions are denied or no nearby gym promotions exist, curated platform-wide fallback banners (e.g. seasonal passes or app features) render seamlessly.

---

### 9.2 Single Source of Truth (SSOT) Gym Operating Hours & Dynamic Slot Engine

#### Overview
To prevent discrepancies between advertised gym hours and actual booking slot availability, GYMEZY establishes a centralized operating hours schema in `gym.model.js` (`operatingHours` subdocument) consumed by both Web and Mobile platforms via `gymTimingHelper.js`.

#### Data Schema
```javascript
operatingHours: {
  monday:    { isOpen: Boolean, openTime: String, closeTime: String },
  tuesday:   { isOpen: Boolean, openTime: String, closeTime: String },
  wednesday: { isOpen: Boolean, openTime: String, closeTime: String },
  thursday:  { isOpen: Boolean, openTime: String, closeTime: String },
  friday:    { isOpen: Boolean, openTime: String, closeTime: String },
  saturday:  { isOpen: Boolean, openTime: String, closeTime: String },
  sunday:    { isOpen: Boolean, openTime: String, closeTime: String }
}
```

#### Core Engine Capabilities (`gymTimingHelper.js`)
1. **Live Open/Closed Calculation:** Evaluates `isOpen`, `openTime`, and `closeTime` for the current day in `Asia/Kolkata` time zone.
2. **Countdown Badges:** Computes exact countdown strings (*Closes in 45m* or *Opens at 06:00 AM*).
3. **Dynamic Slot Generation (`generateAvailableSlots`):**
   - Segregates day into **Morning Slots** (before 12:00 PM) and **Evening Slots** (12:00 PM onward).
   - Generates 1-hour bookable increments strictly within the gym's opening window.
   - Automatically excludes past slots when viewing today's calendar.

---

### 9.3 Per-Session Booking & Trainer Add-on Architecture

#### Overview
Users can book single-session day passes or custom multi-date workout sessions on the gym floor or in specialized classes without purchasing a monthly membership.

#### Pricing Architecture
- **Base Fee:** `gym.pricing.perDayPrice` (or gym session rate).
- **Trainer Single Session Fee:** `employee.trainerPricing.singleSession` (or `personalTrainingFee`).
- **Calculation Formula:**
  $$\text{Total Amount} = \text{Sessions Count} \times (\text{Base Day Price} + \text{Trainer Single Session Fee})$$

#### Custom Multi-Date Engine
- Users select non-contiguous dates (e.g., 24th, 26th, and 27th).
- Backend creates an array of `customDates`:
  ```javascript
  customDates: [
    { date: Date, status: 'Scheduled', dailyOtp: String }
  ]
  ```
- Each scheduled session generates a unique daily 6-digit OTP and dynamic QR token. On the scheduled date, turnstile scanning verifies that specific session and marks it `Attended`.

---

### 9.4 Section Batch Scheduling, Turnstile QR Check-in & Auto Check-Out

#### Overview
Sections represent capacity-constrained, coach-led group batches (Yoga, Zumba, HIIT, Boxing, CrossFit, Strength) with fixed date ranges and active weekly schedules.

#### Batch Access & Attendance Lifecycle
1. **Batch Validation:**
   - Pre-start check: Rejects check-in before `section.startDate`.
   - Expiration check: Rejects check-in after `section.endDate`.
   - Scheduled days check: Rejects entry on non-active weekdays (e.g., Tuesday when batch is Mon/Wed/Fri).
   - Same-day duplicate check: Prevents multiple check-ins on the same day for the same batch.
2. **Audit Tracking:**
   - **`Attendance` Collection:** Creates a check-in log with `status: 'Checked-In'` and `area: 'Section - [Title]'`.
   - **`Booking` Model:** Increments `attendedSessionsCount += 1`, appends audit item to `attendanceHistory [{ attendedAt, method, area }]`.
   - When `attendedSessionsCount >= durationDays`, booking status automatically transitions to `Completed`.
3. **Auto Check-Out on Rescan (Tap-In, Tap-Out):**
   - If a member with an active `Checked-In` status rescans their QR pass or enters their OTP at the gym on the same date, the system records departure:
     - Updates status to `Completed`.
     - Records `checkOutTime: now`.
     - Calculates total duration spent (e.g., *1h 24m*).
     - Returns `action: 'CHECK_OUT'`.
   - **Debounce Safety:** Enforces a 2-minute debounce delay between check-in and check-out to avoid accidental double triggers from turnstile camera auto-focus.

---

### 9.5 Part-Time & Temporary Staff Management Module

#### Overview
Gym owners can onboard part-time coaches (working specific days and hours) and temporary contract instructors (working for a limited date window) directly through a dedicated 2-column modal.

#### Schema Specifications (`employee.model.js`)
```javascript
{
  type: {
    type: String,
    enum: ['Full-Time', 'Part-Time', 'Temporary'],
    default: 'Full-Time'
  },
  schedule: {
    workingDays: [{ type: String }],
    workingTimeStart: { type: String, default: '09:00 AM' },
    workingTimeEnd: { type: String, default: '06:00 PM' },
    isDifferentDays: { type: Boolean, default: false },
    dayWiseHours: [
      { day: String, startTime: String, endTime: String }
    ],
    startDate: { type: String },
    endDate: { type: String }
  },
  compensation: {
    payType: { type: String, enum: ['Hourly', 'Session', 'Daily', 'Weekly', 'Monthly'] },
    payAmount: { type: Number, default: 0 },
    payFreq: { type: String, enum: ['Per Hour', 'Per Session', 'Daily', 'Weekly', 'Monthly'] }
  },
  notes: { type: String, maxlength: 250 }
}
```

#### Governance & Workflows
- **Direct Auto-Approval:** Part-Time and Temporary staff created by gym owners receive immediate `approvalStatus: 'Approved'` and `status: 'Active'` without requiring Super Admin approval.
- **Super Admin Oversight:** Super Admin dashboard retains full audit visibility with filter toggles (`Full-Time`, `Part-Time`, `Temporary`) and can inspect or suspend accounts.
- **Automatic Contract Expiration:** The nightly cron (`0 2 * * *` in `attendanceCron.service.js`) automatically inspects staff where `type === 'Temporary'` and `schedule.endDate < today`, transitioning them to `status: 'Inactive'` with audit remark `Contract Expired - Auto-deactivated by Nightly Cron`.

---

### 9.6 Strict Trainer Schedule Enforcement Across Bookings & Membership Tiers

#### Overview
Because part-time and temporary staff work strict hours and dates, the system enforces automated boundary constraints to prevent users from booking them outside their availability.

#### Enforcement Mechanisms

```mermaid
flowchart TD
    A["User Selects Trainer"] --> B{"Trainer Type"}
    B -->|Full-Time| C["Allow All Gym Operating Days & Hours"]
    B -->|Part-Time / Temporary| D["Enforce Strict Boundaries"]
    
    D --> E["Calendar Day Filter"]
    E -->|Check workingDays| F["Disable Off-Days on Calendar"]
    
    D --> G["Working Hours Filter"]
    G -->|generateTrainerAvailableSlots| H["Generate Slots Strictly Between workingTimeStart & workingTimeEnd"]
    
    D --> I{"Contract End Date Check"}
    I -->|Date > endDate| J["Block Booking / Show Contract Expired"]
    I -->|Date <= endDate| K["Allow Slot Selection"]
```

1. **Per-Session & Day Pass Bookings:**
   - **Calendar Day Filtering:** When a part-time trainer is selected, only dates matching `schedule.workingDays` (e.g. Mon, Wed, Fri) remain active on the booking calendar.
   - **Slot Intersection (`generateTrainerAvailableSlots`):** Available booking slots are generated strictly within `schedule.workingTimeStart` to `schedule.workingTimeEnd` (e.g. 04:00 PM - 07:00 PM) rather than full gym opening hours.
   - **Contract Expiration Guard:** If the trainer is `Temporary`, dates beyond `schedule.endDate` are disabled.
   - **Backend API Validation:** `booking.controller.js` validates requested `startDate`, `customDates`, and `timeSlot` against the trainer's schedule. Any booking outside their hours or contract window returns an `ApiError.badRequest`.
2. **Standard Membership Tiers (Personal Training Add-on):**
   - **Coaching Window Notice:** Membership cards display the trainer's dedicated coaching hours (e.g. *Coaching Window: Mon, Wed, Fri • 04:00 PM - 07:00 PM*).
   - **Duration Safeguard:** In `GymProfileManagement.jsx` and `membership.controller.js`, temporary staff whose contract ends before the tier plan duration completes cannot be assigned to that tier, preventing orphaned memberships.

---

### 9.7 Google Single Sign-On (SSO) & Firebase Cloud Messaging (FCM) Architecture

#### 9.7.1 Unified Firebase Architecture Overview
GYMEZY utilizes the **Unified Firebase Suite** (`firebase` client SDK and `firebase-admin` server SDK) to orchestrate both Google OAuth Sign-In and cross-platform Push Notifications:
1. **Google Cloud Console vs Firebase Console Synergy:**
   - **Google Cloud Console:** Generates OAuth 2.0 Web and Android/iOS Client IDs, manages API quotas, and provisions Service Accounts.
   - **Firebase Console:** Acts as the centralized developer management plane for Firebase Authentication (Google Identity Provider) and Firebase Cloud Messaging (APNs & Android push notifications).
   - **Backend Integration:** `firebase-admin` handles token verification (`verifyIdToken`) and bulk notification dispatch (`sendEachForMulticast`) through a single service account credential (`FIREBASE_SERVICE_ACCOUNT_KEY`).

#### 9.7.2 Deferred Onboarding Flow for Gym Owners (Strict DB Cleanliness)
To preserve the structural integrity of gym partner records, clicking "Sign in with Google" on the Gym Owner portal **never creates a premature user record in MongoDB** if the account is new:

```mermaid
sequenceDiagram
    autonumber
    actor Owner as Gym Owner
    participant Client as Gym Owner Web (/login)
    participant Google as Firebase Auth (Google)
    participant Server as GYMEZY API (/api/v1/auth)
    participant DB as MongoDB
    participant Register as Gym Owner Web (/register)

    Owner->>Client: Clicks "Sign in with Google"
    Client->>Google: signInWithPopup(GoogleAuthProvider)
    Google-->>Client: Returns idToken & Profile
    Client->>Server: POST /google-login { idToken }
    Server->>Google: verifyIdToken(idToken)
    Server->>DB: User.findOne({ $or: [{ googleId }, { email }] })
    alt User Found in DB
        Server-->>Client: Returns { token, user } (Logged In)
    else User Not Found (New Owner)
        Note over Server,DB: NO USER IS CREATED IN DB
        Server-->>Client: Returns { exists: false, isNewUser: true, profile: { email, name, googleId } }
        Client->>Register: Redirect to /register with state: { googleProfile }
        Note over Register: Email auto-filled & locked.<br/>Password fields hidden.<br/>Step 1 validated seamlessly.
        Owner->>Register: Completes Gym Details, Amenities & Banking (Steps 1–5)
        Register->>Server: POST /gyms/register { ..., authProvider: 'GOOGLE', googleId, isSsoEnabled: true }
        Server->>DB: Atomically creates Owner User & Gym documents
        Server-->>Register: Success: Gym & Owner Created!
    end
```

#### 9.7.3 Google SSO Management & Account Lockout Safeguard
- **Granular Control:** Super Admins (`/admin/settings`) and Gym Owners (`GymProfileManagement.jsx` -> Settings Tab) can independently enable or disable Google SSO login for their accounts via `PATCH /api/v1/auth/toggle-sso`.
- **Lockout Prevention:** If a user onboarded via Google SSO attempts to disable SSO without setting a local account password, the backend blocks the operation with an error (`400 Bad Request: "Cannot disable SSO without setting an account password first. Set a password to prevent lockout."`).

#### 9.7.4 Firebase Push Notifications (FCM)
- **Token Registration:** Mobile apps (`mobile-application/user-react` and `mobile-application/gym-owner`) register active device tokens via `POST /api/v1/notifications/device-token`.
- **Multi-Device Support:** The `User` model stores an array of tokens (`fcmTokens: [{ token, platform, lastUsedAt }]`).
- **Token Hygiene:** Stale or unregistered tokens reported by FCM errors (`messaging/registration-token-not-registered`) are automatically pruned from MongoDB.
- **Graceful Fallback:** In development mode without live Firebase credentials, `firebase.service.js` safely operates in mock mode, logging token verifications and notification payloads to the console without crashing.

#### 9.7.5 Production Configuration Checklist
To deploy Google SSO and FCM live, configure the following environment variables:

| Environment Variable | Service | Description |
| :--- | :--- | :--- |
| `FIREBASE_PROJECT_ID` | Backend & Web | Firebase Project ID (e.g. `gymezy-prod`) |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Backend (`middleware/.env`) | JSON string or path to Firebase Service Account Key |
| `VITE_FIREBASE_API_KEY` | Web Portals | Web API Key from Firebase Console Project Settings |
| `VITE_FIREBASE_AUTH_DOMAIN` | Web Portals | Firebase Auth Domain (e.g. `gymezy-prod.firebaseapp.com`) |
| `VITE_FIREBASE_PROJECT_ID` | Web Portals | Project ID matching backend |
| `VITE_FIREBASE_APP_ID` | Web Portals | Web App ID generated in Firebase Console |

---

*Authored for the GYMEZY Platform Engineering & Architecture Team.*


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
        S3[("AWS S3 / Cloudinary (Media & Photos)")]
    end

    UA -->|HTTPS / WSS| GW
    OA -->|HTTPS / WSS| GW
    WA -->|HTTPS| GW

    GW --> AUTH --> RL
    RL --> USVC & GSVC & BSVC & MSVC & PSVC & ASVC & NSVC

    USVC & GSVC & BSVC & MSVC & PSVC & ASVC --> MDB
    BSVC & ASVC --> REDIS
    USVC & GSVC --> S3
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
*Authored for the GYMEZY Platform Engineering & Architecture Team.*

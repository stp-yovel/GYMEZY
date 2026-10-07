Viewed BuyMembershipScreen.js:1-150
Viewed BuyMembershipScreen.js:460-520

Here is the comprehensive architectural analysis and step-by-step implementation plan for standardizing **Gym Membership Pricing, Duration Tiers, and Benefit Icons** across the database, Gym Owner Onboarding & Profile Edit, Super Admin Approval, and the Mobile App.

---

## 🏗️ Architecture & Analysis

### 1. The Core Problem
Currently:
* **Mobile App** ([BuyMembershipScreen.js](file:///Users/yovelr/Softrate/GYMEZY/mobile-application/user-react/src/pages/BuyMembershipScreen.js)): Hardcoded 4 plan tiers (`Monthly`, `Quarterly`, `Half Yearly`, `Annual`) and hardcoded benefits with specific icons (`all-inclusive`, `group`, `lock-outline`, `confirmation-number`, `restaurant-menu`).
* **Gym Owner Portal** ([GymProfileManagement.jsx](file:///Users/yovelr/Softrate/GYMEZY/web-application/gym-owner/src/owner/components/GymProfileManagement.jsx)): Plans are free-text strings for features without standardized icons, and durations/savings are not tied to mobile rules.
* **Super Admin Portal** ([GymsManagement.jsx](file:///Users/yovelr/Softrate/GYMEZY/web-application/super-admin/src/admin/GymsManagement.jsx)): Diffs need structured display showing tier badges, duration days, savings, and benefit icons.

---

## 📊 1. Standard Plan Rules & Schema Design

### Standard Tiers & Duration Rules
| Tier Key | Standard Name | Duration Label | Valid Days | Badge / Highlight | Savings Formula (Auto-calculated) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `single` | Single Session Pass (Walk-in) | `1 Day` | 1 | `WALK-IN` | — |
| `monthly` | Monthly Unlimited | `1 Month` / `30 Days` | 30 | `MONTHLY` | Base comparison rate |
| `quarterly` | Quarterly Transformation | `3 Months` / `90 Days` | 90 | `QUARTERLY` | `(MonthlyPrice * 3) - QuarterlyPrice` |
| `half_yearly`| Half-Yearly Power Pack | `6 Months` / `180 Days` | 180 | `HALF-YEARLY` | `(MonthlyPrice * 6) - HalfYearlyPrice` |
| `annual` | Annual VIP Elite | `12 Months` / `365 Days` | 365 | `ANNUAL` (`Best Value`) | `(MonthlyPrice * 12) - AnnualPrice` |

---

### Standard Benefit Features & Icon Mapping (Universal Icon Set)
Every feature will have `{ text: string, icon: string }` supporting both MaterialIcons (Mobile) and Ant Design / Lucide icons (Web):

| Benefit Feature | Material Icon (Mobile) | Purpose |
| :--- | :--- | :--- |
| **All Gym Floor Access** | `all-inclusive` / `fitness-center` | Full gym equipment access |
| **Group Workout Classes** | `group` / `groups` | Zumba, Yoga, Crossfit |
| **Locker & Shower Facility** | `lock-outline` / `shower` | Locker room & shower |
| **Guest Workout Passes** | `confirmation-number` | Monthly guest entries |
| **Nutrition & Diet Guidance** | `restaurant-menu` | Diet Consultation / InBody BMI |
| **Steam & Sauna Access** | `hot-tub` / `spa` | Wellness & Recovery |
| **Personal Trainer Sessions** | `person` / `supervisor-account` | Complimentary PT Sessions |
| **VIP Towel & Kit Service** | `check-circle` | VIP amenities |

---

## 🗄️ 2. Database Schema (`gym.model.js`)

We will enhance `customPlanSchema` in [gym.model.js](file:///Users/yovelr/Softrate/GYMEZY/middleware/src/models/gym.model.js):

```javascript
const planFeatureSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    icon: { type: String, default: 'check-circle', trim: true },
  },
  { _id: false }
);

const customPlanSchema = new mongoose.Schema(
  {
    id: { type: String, trim: true },
    tierKey: { 
      type: String, 
      enum: ['single', 'monthly', 'quarterly', 'half_yearly', 'annual', 'custom'],
      default: 'monthly' 
    },
    name: { type: String, required: true, trim: true },
    badge: { type: String, trim: true, default: 'Monthly' },
    price: { type: Number, required: true, min: 0 },
    duration: { type: String, trim: true, default: '30 Days' },
    durationDays: { type: Number, default: 30 },
    originalPrice: { type: Number, min: 0 }, // For crossed out price / savings calculation
    savingsText: { type: String, trim: true }, // e.g. "Save ₹598"
    description: { type: String, trim: true, default: '' },
    features: [planFeatureSchema], // Structured features with icon
    popular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { _id: false }
);
```
*(Backward-compatibility helper included to automatically parse existing array of strings `['All Gym Floor Access', ...]` into structured `{ text, icon }` objects).*

---

## 🗺️ 3. Implementation Plan by Component

### A. Middleware & Controllers ([gym.controller.js](file:///Users/yovelr/Softrate/GYMEZY/middleware/src/controllers/gym.controller.js))
1. **Auto Savings & Duration Calculation**: When saving or proposing plan changes, auto-calculate `savingsText` and `durationDays` based on the base monthly price if not explicitly provided.
2. **Backward Compatibility Converter**: Ensure both string features and `{ text, icon }` features are normalized cleanly.

### B. Gym Owner Onboarding & Edit Profile ([GymProfileManagement.jsx](file:///Users/yovelr/Softrate/GYMEZY/web-application/gym-owner/src/owner/components/GymProfileManagement.jsx) & Onboarding)
1. **Tier Selector**: Pre-configured templates (`Monthly`, `Quarterly`, `Half-Yearly`, `Annual`, `Single Session`).
2. **Benefit Feature Manager**: Checkboxes for standard features with preset icons (`All Gym Floor Access`, `Group Classes`, `Locker & Shower`, `Nutrition Guidance`, `PT Sessions`) + custom feature input with icon selector.
3. **Card Rendering**: Render cards matching screenshot 1 with tier badge, price per duration, description, green checkmark icon benefits list, and popular badge.

### C. Super Admin Approval Review ([GymsManagement.jsx](file:///Users/yovelr/Softrate/GYMEZY/web-application/super-admin/src/admin/GymsManagement.jsx))
1. **Structured Diff Cards**: Render old vs new plan cards showing tier, price, duration days, savings tag, and feature items with their icons.
2. **Single-Field Clean Diffs**: Only track `customPricingPlans` in `pendingChanges` so approval is 1 clean action.

### D. Mobile App ([BuyMembershipScreen.js](file:///Users/yovelr/Softrate/GYMEZY/mobile-application/user-react/src/pages/BuyMembershipScreen.js) & [GymDetailsScreen.js](file:///Users/yovelr/Softrate/GYMEZY/mobile-application/user-react/src/pages/GymDetailsScreen.js))
1. **Dynamic Plans Loading**: Replace hardcoded `PLANS` object with dynamic plans from `gym.customPricingPlans` (falling back gracefully to defaults if empty).
2. **Dynamic Plan Radio Cards**: Display each tier card matching screenshot 2 with calendar icon, plan name, price/duration, `Valid for X days`, and green `Save ₹...` badge.
3. **Dynamic Benefits Section with MaterialIcons**: When a user selects a plan (e.g. `Monthly`, `Quarterly`), the **"Plan Benefits (<SelectedPlan>)"** list dynamically renders the exact benefit items and matching `MaterialIcons` from that plan.

---

### 🚦 Approval to Proceed
Would you like me to start implementing this starting from the **Database Schema & Controller**, followed by the **Gym Owner Portal (Edit + Onboarding)**, **Super Admin Approval Review**, and **Mobile App**?
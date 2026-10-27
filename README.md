# JobPortal System 🚀

A modern, responsive Job Portal Web Application built with **React.js (Vite)**, **Tailwind CSS v4**, **Context API**, **React Router v7**, and **React Hook Form**.

---

## 🛠️ Technology Stack
- **Frontend Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS v4 & PostCSS
- **State Management:** React Context API (AuthContext, DashboardContext)
- **Routing:** React Router v7 (`react-router-dom`)
- **Form Handling & Validation:** React Hook Form
- **Feedback & Alerts:** React Toastify
- **Icons:** Lucide React
- **Persistence:** Local Storage API

---

## 📦 Implemented Modules (Phase 1 & Phase 2)

### ✅ Module 1: Authentication
- **Login Page:** Pixel-matched to design specs featuring:
  - Office ambience hero with high-contrast split view
  - Dynamic branding `JobPortal`
  - Hero headline: *"Find Your Dream Job"*
  - Feature badges: Verified Companies, Easy Job Applications, Build Your Profile, Get Hired Faster
  - Stats highlight: `50K+ Jobs`, `10K+ Companies`, `1M+ Job Seekers`
  - Floating card design with rounded corners & clean shadows
  - Role switcher tab (**Candidate** / **Recruiter**)
  - Form validation with React Hook Form
  - Password visibility toggle (Show/Hide password)
  - "Remember me" checkbox
  - "Forgot password?" navigation
  - Single-click social authentication simulation (Google & LinkedIn)
  - Quick Autofill buttons for fast demo testing
- **Register Page:**
  - Role selection cards (**Candidate** vs **Recruiter**)
  - Full Name, Email, Password, Confirm Password, and optional Company Name
  - Password confirmation matching validation
  - Terms and conditions agreement
  - Instant account registration stored in Local Storage
- **Forgot Password UI:**
  - Email verification input
  - Reset instructions dispatch simulation
  - Instant testing password reset option
- **Protected Routes:**
  - Authenticated session guard with redirect fallback
- **Role Support:**
  - Seamless switching between Candidate and Recruiter profiles
- **Session & Persistence:**
  - Persistent auth session in Local Storage with graceful logout

---

### ✅ Module 2: Responsive Dashboard
- **Sidebar Navigation:**
  - Collapsible responsive drawer for mobile & desktop
  - Live route indicator and tab navigation (Overview, Jobs Directory, Companies, Applications, Saved Jobs)
  - Role badge indicator with one-click view switcher
  - User profile badge with one-click Logout
- **Header (Topbar):**
  - Instant global search input across jobs, titles, and companies
  - Time-aware dynamic greeting
  - Interactive Notifications bell with unread count and popover list
  - Candidate/Recruiter quick mode pill toggle
- **Platform Statistics Cards:**
  - **Total Companies** (1,240, +12.4%)
  - **Total Jobs** (8,520, +8.2%)
  - **Active Job Postings** (3,180, 94% active rate)
  - **Total Candidates** (45,290, +15.7%)
  - **Total Applications** (12,840, +22.5%)
  - **Saved Jobs** (Live count tracking)
- **Quick Action Cards:**
  - Role-adaptive actions for Candidates (*Browse Jobs*, *Saved Bookmarks*, *Track Applications*, *Explore Companies*)
  - Role-adaptive actions for Recruiters (*Post a Job*, *Review Applications*, *Search Talent*, *Company Profile*)
- **Active Job Postings List:**
  - Displays company logo, title, location, salary, experience, and employment tags
  - Real-time search query filtering
  - Quick Apply button with toast notifications and application count increments
  - Save / Bookmark toggle button with instant sync to Local Storage
- **Recent Activities Feed:**
  - Chronological timeline with filter pills (All, Applications, Interviews, Postings)
  - Status indicators (In Review, Interview, Active, Viewed, Saved)
- **Recruiter Post Job Modal:**
  - Modal with form validation for creating new openings
  - Immediately updates platform statistics and recent activities
- **UI/UX Enhancements:**
  - Animated skeleton pulse loaders for smooth initial data hydration
  - Reusable Empty State UI components
  - Toast notifications for user actions

---

## 🔑 Demo Credentials (Pre-seeded in Local Storage)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Candidate** | `candidate@jobportal.com` | `password123` |
| **Recruiter** | `recruiter@jobportal.com` | `password123` |

*(You can also use the single-click Quick Fill buttons on the Login page or register a new custom account.)*

---

## 🚀 How to Run Locally

```bash
# 1. Navigate to the project directory
cd C:\STACKLY\job-portal

# 2. Start the development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

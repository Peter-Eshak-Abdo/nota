# Project: "Nota" - Church Youth Spiritual Tracker & Gamified Habit Builder

## 🎯 Context & Goal
You are an expert Full-Stack Engineer, System Architect, and UI/UX Designer. Your task is to build a complete, production-ready Full-Stack web application named "Nota" using Next.js. 
This application is a specialized "Spiritual Note" (نوتة روحية) for high school church youth (Makhdomeen) to track their spiritual habits (Bible reading, Prayer, Communion, Confession) based on the "Atomic Habits" methodology. It aims to build a deep spiritual relationship with God through gamification, interactive challenges, and continuous servant follow-up.

## 🛠️ Tools & Workflow Instructions
- Use your **MCP (Model Context Protocol)** capabilities to the fullest.
- Use **Stitch** for designing a highly intuitive, modern, and engaging UI/UX.
- Use **Google AI Studio** for logic building, architecture, and backend generation.
- Ensure the system design is fully documented, modular, and scalable for future enhancements.

## 💻 Tech Stack
- **Framework:** Next.js (Full Stack: Frontend & API Routes).
- **Database & Auth:** Firebase (Firestore, Firebase Auth) - *Note: Supabase is excluded for this project.*
- **Styling:** Tailwind CSS.
- **PWA:** Must be a Progressive Web App, fully responsive, and highly optimized for iPhones and all mobile devices.
- **State Management & Offline Support:** Must work **Offline-First**. Users can log tasks offline, and the UI must display a clear indicator that "Changes are saved locally and will sync upon internet connection."

## 🔐 Security & System Architecture
- Implement robust Cyber Security measures (CSRF, XSS protection, API rate limiting).
- Secure all Next.js API routes and implement strict Firebase Security Rules based on roles.
- Design a clean System Architecture (Separation of concerns, MVC/Service patterns within Next.js).

## 👥 Roles & Access Control (RBAC)
1. **Admin (Main Admin/s):**
   - Has full control over the system.
   - Assigns Servants (Khodam) to specific Youths (Makhdomeen). Can rotate these assignments monthly.
   - Adds global Sermons (وعظات) or targets them to specific youths.
   - Approves or Rejects modifications suggested by Servants regarding Youth profiles/tasks.
2. **Servant (Khadem):**
   - Views only their assigned Youths.
   - Cannot directly modify Youth data; any edit request goes to the Admin for approval.
   - Has a "Private Notes" section for each youth (visible only to the specific servant and the Admin).
   - Can assign specific sermon links to a youth's dashboard.
3. **Youth (Makhdoom):**
   - Accesses their gamified dashboard to log daily/weekly tasks.
   - Watches assigned sermons.

## ✨ Core Features & Business Logic

### 1. The Spiritual Law (القانون الروحي) & Anti-Cheat Mechanism
- Tracks: Bible Reading, Prayer, Communion, Confession.
- **Interactive Validation (Anti-AI & Anti-Search):**
  - When a youth marks a task (e.g., reading a specific Bible chapter or taking Communion), the system pops up a **highly randomized, situational question**.
  - Example for Bible: "If you were in this specific character's situation in this chapter, how would you act?"
  - Example for Communion: Questions about the Synaxarium or the day's readings.
  - **The Logic:** Questions must be dynamically mapped to the specific chapter/event. 
  - **Timer:** The question must have a strict countdown timer. The timer's duration must be programmatically linked to the length/complexity of the question to prevent the user from searching Google or asking AI. Answers should be brief.

### 2. Gamification & "Atomic Habits" Engagement
- **Daily Progress (Mystery Shapes):** 
  - The daily tasks (Bible, Prayer, etc.) are represented as a blank canvas. 
  - Every completed task adds a random, mysterious dot/piece to the canvas. 
  - Once all daily tasks are done, the shape is revealed (e.g., Bible reading forms a shape of someone knowing God, Prayer forms a shape of a relationship with God).
- **Monthly Celebration (30-Day Streak):** 
  - A 30-day streak puzzle. Every daily completion colors a part of a larger, beautiful image.
  - Upon completing the 30 days, a massive interactive celebration triggers (Sound + Visual effects).
  - The youth can share this achievement (Shareable component).

### 3. Sermons & Content (الوعظات)
- A dedicated section where Admin/Servants can drop links for sermons.
- It doesn't have to be watched immediately; it acts as a personalized spiritual playlist for the youth.

## 🚀 Execution Steps for the AI
1. **Phase 1: System Design & Architecture.** Outline the database schema (Firebase Collections), API structure, and offline-sync strategy.
2. **Phase 2: UI/UX Generation (via Stitch).** Create the PWA layouts, gamification components, and dashboards for all 3 roles.
3. **Phase 3: Backend & API (via AI Studio).** Build secure Next.js APIs, Firebase integrations, and the validation/timer logic.
4. **Phase 4: Gamification Logic.** Implement the dot-matrix image reveal and the 30-day celebration logic.

Please generate the complete codebase step-by-step following the architecture above, ensuring production-ready code.
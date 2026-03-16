# Coby Learn AI Frontend

CobyLearnAi is a integrated AI-assisted learning platform to bridge the gap between passive reading and active mastering. Students can upload study materials, generate quizzes and flashcards, chat with an AI tutor, and track progress. By leveraging the power of Gemini AI and modern frontend engineering, it empowers students to turn dense PDFs, YouTube lectures, and raw notes into structured study guides, adaptive quizzes, and interactive flashcards.

**Website Name:** Coby Learn AI (shown in UI as CobyLearnAi)

**Team Name:** hmm, apa ya

**With Backend:** Not in code base, in seperate repository ([The Backend Repository](https://github.com/mohamadarif03/focus-room-be))

---

## **Main Features**

### 📖 **Intelligent Material Management**

* **Multi-Source Input:** Seamlessly upload PDFs, raw text, or YouTube links.
* **Smart Summarization:** AI extracts core concepts, definitions, and key takeaways for efficient learning.
* **Library Organization:** A clean, folder-based system for efficient study material management.

---

### 🎯 **Active Learning & Evaluation**

* **Adaptive Quiz Generation:** Instantly generate multiple-choice quizzes from any material.
* **Flashcard System:** Flashcards created automatically by AI.
* **AI Tutor:** A chatbot companion tied to specific materials that acts as a personalized study partner.

---

### 📊 **Progress & Habit Tracker**

* **Personalized Dashboard:** One-glance view of daily quiz status, focus streaks, and pending tasks.
* **Productivity Heatmap:** Comprehensive task planning with Google Calendar integration and visualization to track consistency over time.
* **Pomodoro Integration:** Focus timer and Lofi Radio to facilitate study sessions.

---

### 🎨 **Intuitive User Experience**

* **Material UI Design:** Utilizes a native-based design to provide a familiar, intuitive, and high-performance interface.
* **PWA Support:** Full Progressive Web App support for seamless mobile use, ensuring students can stay productive anytime, anywhere with increased access.

---

## Tech Stack

- React 19 + TypeScript
- Vite 7
- MUI 7 (Material UI)
- React Router 7
- TanStack Query
- Axios
- Zustand
- Framer Motion
- Vite PWA plugin


## Project Structure

```text
src/
  components/
    auth/            # Route protection middleware
    dashboard/       # Dashboard widgets and onboarding
    landing-page/    # Marketing landing sections
    library/         # Folder/material dialogs and items
    progress/        # Stat cards and heatmap
    tasks/           # Task dialogs, list items, calendar
    common/          # Shared UI widgets/dialogs
  pages/             # Route-level pages
  services/          # API service layer by domain
  stores/            # Zustand stores
  theme/             # MUI theme customization
  lib/               # Axios client and app-level utilities
  utils/             # Helper utilities
public/
  manifest.webmanifest
  *.lottie assets
```

## Getting Started

### Prerequisites
- Node.js 20+
- npm 10+

### Install

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build Production

```bash
npm run build
```

## API and Proxy Setup

This frontend uses relative API base path:
- Axios base URL: `/api/v1`

### Local Development
- Vite proxy forwards `/api/v1/*` to backend target configured in [vite.config.ts](vite.config.ts).

### Deployment
- Vercel rewrites `/api/v1/:path*` to backend target configured in [vercel.json](vercel.json).

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Type-check and build
- `npm run preview` - Preview build output
- `npm run lint` - Run ESLint

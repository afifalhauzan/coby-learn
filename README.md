# Coby Learn AI Frontend

CobyLearnAi is a integrated AI-assisted learning platform to bridge the gap between passive reading and active mastering. Students can upload study materials, generate quizzes and flashcards, chat with an AI tutor, and track progress. By leveraging the power of Gemini AI and modern frontend engineering, it empowers students to turn dense PDFs, YouTube lectures, and raw notes into structured study guides, adaptive quizzes, and interactive flashcards.

**Website Name:** Coby Learn AI

**Team Name:** hmm, apa ya

**With Backend:** Not in code base, in seperate repository ([The Backend Repository](https://github.com/mohamadarif03/focus-room-be))

---

## **Main Features**

### 1. **Intelligent Material Management**

* **Multi-Source Input:** Seamlessly upload PDFs, raw text, or YouTube links.
* **Smart Summarization:** AI extracts core concepts, definitions, and key takeaways for efficient learning.
* **Library Organization:** A clean, folder-based system for efficient study material management.

---

### 2. **Active Learning & Evaluation**

* **Adaptive Quiz Generation:** Instantly generate multiple-choice quizzes from any material.
* **Flashcard System:** Flashcards created automatically by AI.
* **AI Tutor:** A chatbot companion tied to specific materials that acts as a personalized study partner.

---

### 3. **Progress & Habit Tracker**

* **Personalized Dashboard:** One-glance view of daily quiz status, focus streaks, and pending tasks.
* **Productivity Heatmap:** Comprehensive task planning with Google Calendar integration and visualization to track consistency over time.
* **Pomodoro Integration:** Focus timer and Lofi Radio to facilitate study sessions.

---

### 4. **Intuitive User Experience**

* **Material UI Design:** Utilizes a native-based design to provide a familiar and intuitive interface.
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

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Type-check and build
- `npm run preview` - Preview build output
- `npm run lint` - Run ESLint

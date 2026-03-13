# Cognivio AI Frontend

The frontend for **Cognivio AI**, an AI-powered learning platform that transforms documents into interactive study experiences.

This application provides the user-facing experience for document upload, AI summaries, flashcards, quizzes, contextual chat, `Voice Chat`, `Voice Overview`, `Podcast Overview`, `Video Overview`, authentication, and subscription management.

---

## Features

- Modern App Router experience built with Next.js
- Authentication flows: login, register, forgot password, reset password
- Google OAuth integration
- Document upload and document library UI
- AI summaries and concept explanations
- Flashcards and quiz interfaces
- Contextual document chat
- `Voice Chat` integration with Vapi
- `Voice Overview`, `Podcast Overview`, and `Video Overview` user flows
- Pricing and Paddle-powered subscription screens
- Dashboard and user profile experience

---

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Radix UI
- Axios
- Framer Motion
- React Hook Form
- KaTeX / Markdown rendering utilities

---

## Project Structure

```text
frontend/
├─ public/                   # Static assets
├─ src/
│  ├─ app/                   # App Router pages, route groups, layouts
│  ├─ components/            # Shared components and feature-specific UI
│  ├─ context/               # Global React context providers
│  ├─ lib/                   # Library integrations (e.g. Vapi)
│  ├─ services/              # API service wrappers
│  ├─ utils/                 # Helpers, API config, shared utilities
│  └─ types.d.ts             # Shared type declarations
├─ components.json           # UI component config
├─ next.config.ts            # Next.js configuration
├─ package.json              # Scripts and dependencies
└─ tsconfig.json             # TypeScript configuration
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Running Cognivio AI backend server

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key
NEXT_PUBLIC_VAPI_WORKFLOW_ID=your_vapi_workflow_id
NEXT_PUBLIC_PADDLE_ENV=sandbox
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=your_paddle_client_token
```

### Run in Development

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## Available Scripts

- `npm run dev` — Start the development server
- `npm run build` — Build the app for production
- `npm run start` — Start the production server
- `npm run lint` — Run ESLint

---

## Frontend Responsibilities

This repository is responsible for:

- Rendering all user-facing pages and flows
- Managing authenticated client sessions
- Calling backend APIs for AI and document operations
- Handling subscription and pricing flows
- Displaying generated learning assets and interactive study tools

---

## Related Repositories

- Root project repository: parent monorepo/submodule container
- Backend API: Cognivio AI server repository

---


# Cognivio AI — Frontend

The client application for **Cognivio AI**, an AI-powered SaaS learning platform that transforms documents into interactive study experiences.

---

## Overview

This frontend delivers the entire user-facing experience — from onboarding and authentication to document management, AI-powered learning tools, and subscription billing. Built with a modern React stack, it emphasizes performance, accessibility, and a premium visual experience.

---

## ✨ User Experience

- **Document Workspace** — Upload, browse, and manage study materials in a clean, organized library
- **AI Learning Suite** — Summaries, flashcards, quizzes, concept explanations — all generated from uploaded documents
- **Contextual AI Chat** — Ask follow-up questions with full document context awareness
- **Voice Chat** — Real-time voice conversations with an AI tutor via Vapi integration
- **Audio & Video Overviews** — Voice summaries, podcast-style deep dives, and AI-generated video recaps
- **Learning Dashboard** — Track progress, study streaks, and performance analytics
- **Subscription Management** — Tiered pricing with seamless LemonSqueezy checkout flows
- **Profile & Account** — User settings, profile image upload, and account management

---

## 🏗️ Technical Architecture

### Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** | App Router framework with server/client components |
| **React 19** | Latest React with concurrent features |
| **TypeScript** | Full type safety across the application |
| **Tailwind CSS 4** | Utility-first styling with design token system |
| **Radix UI** | Accessible, unstyled component primitives |
| **Framer Motion** | Smooth page transitions and micro-animations |
| **React Hook Form** | Performant form handling with validation |
| **Axios** | HTTP client with interceptors for API communication |
| **KaTeX** | Mathematical formula rendering in AI responses |

### Architecture Patterns

- **App Router** — File-system routing with route groups for authenticated and public sections
- **Service Layer** — Dedicated API service wrappers abstracting all backend communication
- **Context Providers** — Global auth state and shared application context
- **Component Library** — Reusable, composable UI components built on Radix primitives
- **Responsive Design** — Mobile-first layouts with adaptive breakpoints

### Key Design Decisions

- **Route Groups**: `(auth)` for login/register flows, `(dashboard)` for the authenticated learning experience — clean URL structure with distinct layouts
- **Service Abstraction**: All API calls go through a typed service layer, keeping components free of HTTP logic
- **Optimistic UI**: Interactive elements like flashcard starring and quiz submissions use optimistic updates for instant feedback
- **Dynamic Imports**: Heavy components (voice chat, video player) are lazily loaded to minimize initial bundle size

---

## 🎨 UI / UX Highlights

- Premium dark-mode interface with a polished, modern aesthetic
- Smooth scroll animations and page transitions via Framer Motion
- Accessible component patterns using Radix UI primitives
- Responsive across desktop, tablet, and mobile breakpoints
- Rich text and markdown rendering for AI-generated content
- Interactive flashcard review flow with progress tracking

---

## 📂 Codebase Organization

```
frontend/
├── src/
│   ├── app/              # Next.js App Router — pages, layouts, route groups
│   ├── components/       # Reusable UI and feature-specific components
│   ├── context/          # React context providers (auth, global state)
│   ├── services/         # API service wrappers (typed, centralized)
│   ├── lib/              # Library integrations (Vapi, utilities)
│   ├── utils/            # Shared helpers, API config, constants
│   └── types.d.ts        # Global type declarations
├── public/               # Static assets and branding
└── package.json
```

---

## License

Proprietary software. See the [root README](../README.md#license) for details.

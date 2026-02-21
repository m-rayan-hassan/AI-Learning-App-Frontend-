export const BASE_URL = "http://localhost:8080";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GOOGLE_LOGIN: "/api/auth/google",
    FORGOT_PASSWORD: "/api/auth/forgotpassword",
    RESET_PASSWORD: (token: string) => `/api/auth/resetpassword/${token}`,
    GET_PROFILE: "/api/auth/profile",
    UPDATE_PROFILE: "/api/auth/profile",
    CHANGE_PASSWORD: "/api/auth/change-password",
  },

  DOCUMENTS: {
    UPLOAD: "/api/documents/upload",
    GET_DOCUMENTS: "/api/documents",
    GET_DOCUMENT_BY_ID: (id: string) => `/api/documents/${id}`,
    UPDATE_DOCUMENT: (id: string) => `/api/documents/${id}`,
    DELETE_DOCUMENT: (id: string) => `/api/documents/${id}`,
  },

  AI: {
    GENERATE_FLASHCARDS: "/api/ai/generate-flashcards",
    GENERATE_QUIZ: "/api/ai/generate-quiz",
    GENERATE_SUMMARY: "/api/ai/generate-summary",
    CHAT: "/api/ai/chat",
    EXPLAIN_CONCEPT: "/api/ai/explain-concept",
    GET_CHAT_HISTORY: (documentId: string) =>
      `/api/ai/chat-history/${documentId}`,
    GENERATE_VOICE_OVERVIEW: "/api/ai/generate-voice-overview",
    GENERATE_PODCAST: "/api/ai/generate-podcast",
    GENERATE_VIDEO: "/api/ai/generate-video"
  },

  FLASHCARDS: {
    GET_ALL_FLASHCARDS: "/api/flashcards",
    GET_ALL_FLASHCARDS_FOR_DOC: (documentId: string) =>
      `/api/flashcards/${documentId}`,
    REVIEW_FLASHCARD: (cardId: string) => `/api/flashcards/${cardId}/review`,
    TOGGLE_STAR: (cardId: string) => `/api/flashcards/${cardId}/star`,
    DELETE_FLASHCARD_SET: (id: string) => `/api/flashcards/${id}`,
  },

  QUIZZES: {
    GET_QUIZZES_FOR_DOC: (documentId: string) => `/api/quizzes/${documentId}`,
    GET_QUIZ_BY_ID: (id: string) => `/api/quizzes/quiz/${id}`,
    SUBMIT_QUIZ: (id: string) => `/api/quizzes/${id}/submit`,
    GET_QUIZ_RESULT: (id: string) => `/api/quizzes/${id}/results`,
    DELETE_QUIZ: (id: string) => `/api/quizzes/${id}`,
  },

  PROGRESS: {
    GET_DASHBOARD: "/api/progress/dashboard",
  },

  PAYMENTS: {
    SUBSCRIBE: "/api/payments/subscribe",
    GET_SUBSCRIPTION: "/api/payments/subscription",
    PREVIEW_UPGRADE: "/api/payments/preview-upgrade",
    CONFIRM_UPGRADE: "/api/payments/confirm-upgrade",
    CANCEL_SUBSCRIPTION: "/api/payments/cancel",
  },
};

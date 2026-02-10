import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const generateFlashCards = async (documentId: string, options: any) => {
  try {
    const response = await axiosInstance.post(
      API_PATHS.AI.GENERATE_FLASHCARDS,
      {
        documentId,
        ...options,
      },
    );
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to generate flashcards" };
  }
};

const generateQuiz = async (documentId: string, options: any) => {
  try {
    const response = await axiosInstance.post(API_PATHS.AI.GENERATE_QUIZ, {
      documentId,
      ...options,
    });
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to generate quiz" };
  }
};

const generateSummary = async (documentId: string) => {
  try {
    const response = await axiosInstance.post(API_PATHS.AI.GENERATE_SUMMARY, {
      documentId,
    });
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to generate summary" };
  }
};

const chat = async (documentId: string, message: string) => {
  try {
    // Backend expects the field name `question`
    const response = await axiosInstance.post(API_PATHS.AI.CHAT, {
      documentId,
      question: message,
    });
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to chat" };
  }
};

const explainConcept = async (documentId: string, concept: string) => {
  try {
    const response = await axiosInstance.post(API_PATHS.AI.EXPLAIN_CONCEPT, {
      documentId,
      concept,
    });
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to explain concept" };
  }
};

const getChatHistory = async (documentId: string) => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.AI.GET_CHAT_HISTORY(documentId),
    );
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to fetch chat history" };
  }
};

const generateVoiceOverview = async (documentId: string) => {
  try {
    const response = await axiosInstance.post(
      API_PATHS.AI.GENERATE_VOICE_OVERVIEW,
      { documentId },
    );
    return response.data.data;
  } catch (error: any) {
    throw (
      error.response?.data || { message: "Failed to generate voice overview" }
    );
  }
};

const generatePodcast = async (documentId: string) => {
  try {
    const response = await axiosInstance.post(API_PATHS.AI.GENERATE_PODCAST, {
      documentId,
    });
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to generate podcast" };
  }
};

const generateVideo = async (documentId: string) => {
  try {
    const response = await axiosInstance.post(API_PATHS.AI.GENERATE_VIDEO, {
      documentId
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to generate video" };
  }
}
const aiServices = {
  generateFlashCards,
  generateQuiz,
  generateSummary,
  chat,
  explainConcept,
  getChatHistory,
  generateVoiceOverview,
  generatePodcast,
  generateVideo
};
export { aiServices };

import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const getAllFlashCardSets = async () => {
    try {
        const response = await axiosInstance.get(API_PATHS.FLASHCARDS.GET_ALL_FLASHCARDS);  
        return response.data.data;
    } catch (error: any) {
        throw error.response?.data || { message: 'Failed to fetch flashcard sets' };
    }
};

const getFlashCardsforDocument = async (documentId: string) => {
    try {
        const response = await axiosInstance.get(API_PATHS.FLASHCARDS.GET_ALL_FLASHCARDS_FOR_DOC(documentId));  
        return response.data.data;
    } catch (error: any) {
        throw error.response?.data || { message: 'Failed to fetch flashcards' };
    }   
};

const reviewFlashCard = async (CardId: string, cardIndex: number) => {
    try {
        const response = await axiosInstance.post(API_PATHS.FLASHCARDS.REVIEW_FLASHCARD(CardId), { cardIndex });
        return response.data.data;
    } catch (error: any) {
        throw error.response?.data || { message: 'Failed to review flashcard' };
    }
};

const toggleStar = async (CardId: string) => {
    try {
        const response = await axiosInstance.put(API_PATHS.FLASHCARDS.TOGGLE_STAR(CardId));
        return response.data.data;
    } catch (error: any) {
        throw error.response?.data || { message: 'Failed to toggle star' };
    }
};

const deleteFlashCardSet = async (Id: string) => {
    try {
        const response = await axiosInstance.delete(API_PATHS.FLASHCARDS.DELETE_FLASHCARD_SET(Id));
        return response.data;
    } catch (error: any) {
        throw error.response?.data || { message: 'Failed to delete flashcard set' };
    }
};

const flashcardsServices = {
    getAllFlashCardSets,
    getFlashCardsforDocument,
    reviewFlashCard,
    toggleStar,
    deleteFlashCardSet,
};

export default flashcardsServices
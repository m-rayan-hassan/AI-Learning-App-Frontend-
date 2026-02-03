import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const getDocuments = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.DOCUMENTS.GET_DOCUMENTS);
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to fetch documents" };
  }
};

const uploadDocument = async (formData: any) => {
  try {
    const response = await axiosInstance.post(API_PATHS.DOCUMENTS.UPLOAD, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to upload document" };
  }
};

const deleteDocument = async (documentId: string) => {
  try {
    const response = await axiosInstance.delete(API_PATHS.DOCUMENTS.DELETE_DOCUMENT(documentId));
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to delete document" };
  }
};

const getDocumentById = async (documentId: string) => {
  try {
    const response = await axiosInstance.get(API_PATHS.DOCUMENTS.GET_DOCUMENT_BY_ID(documentId));
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to fetch document details" };
  }
};

const updateDocument = async (documentId: string, data: any) => {
  try {
      const response = await axiosInstance.put(API_PATHS.DOCUMENTS.UPDATE_DOCUMENT(documentId), data);
      return response.data.data;
  } catch (error: any) {
      throw error.response?.data || { message: "Failed to update document" };
  }
}

const documentServices = {
  getDocuments,
  uploadDocument,
  deleteDocument,
  getDocumentById,
  updateDocument
};

export default documentServices;
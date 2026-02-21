import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

// Subscribe to a plan — returns action: 'checkout' (new sub) or 'preview_upgrade' (existing sub)
const subscribe = async (targetPlan: string) => {
  try {
    const response = await axiosInstance.post(API_PATHS.PAYMENTS.SUBSCRIBE, { targetPlan });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to process subscription" };
  }
};

// Get the prorated charge preview before applying an upgrade
const previewUpgrade = async (targetPlan: string) => {
  try {
    const response = await axiosInstance.post(API_PATHS.PAYMENTS.PREVIEW_UPGRADE, { targetPlan });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to preview upgrade" };
  }
};

// Confirm and apply the subscription upgrade after user reviews the charge
const confirmUpgrade = async (targetPlan: string) => {
  try {
    const response = await axiosInstance.post(API_PATHS.PAYMENTS.CONFIRM_UPGRADE, { targetPlan });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to confirm upgrade" };
  }
};

// Get current subscription status
const getSubscription = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.PAYMENTS.GET_SUBSCRIPTION);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to fetch subscription" };
  }
};

// Cancel the current subscription
const cancelSubscription = async () => {
  try {
    const response = await axiosInstance.post(API_PATHS.PAYMENTS.CANCEL_SUBSCRIPTION);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to cancel subscription" };
  }
};

const paymentServices = {
  subscribe,
  previewUpgrade,
  confirmUpgrade,
  getSubscription,
  cancelSubscription,
};

export { subscribe, previewUpgrade, confirmUpgrade, getSubscription, cancelSubscription };
export default paymentServices;

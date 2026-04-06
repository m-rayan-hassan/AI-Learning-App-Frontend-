import axios from 'axios';
import { getAccessToken } from './axiosInstance';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Send cookies on every request
});

API.interceptors.request.use((req) => {
  const token = getAccessToken();
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
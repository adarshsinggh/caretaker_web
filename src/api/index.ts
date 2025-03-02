import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';
const HELPERS_API_URL = 'http://localhost:4000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('user') 
    ? JSON.parse(localStorage.getItem('user') || '{}').token 
    : null;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const signUp = async (userData: { name: string; email: string; password: string; appliedReferralCode?: string }) => {
  return api.post('/auth/signup', userData);
};

export const login = async (credentials: { email: string; password: string }) => {
  return api.post('/auth/login', credentials);
};

// Parents APIs
export const addParent = async (parentData: { 
  name: string; 
  contact: string; 
  address: string; 
  medicalInfo: string;
  age: number;
}) => {
  return api.post('/parents', parentData);
};

// Addresses APIs
export const getAddresses = async () => {
  return api.get('/addresses');
};

// Bookings APIs
export const createBooking = async (bookingData: {
  parentId: string;
  serviceType: string;
  serviceDate: string;
  recurring: boolean;
  specialInstructions: string;
  paymentMethod: string;
  discountCode?: string;
}) => {
  return api.post('/bookings', bookingData);
};

// Helpers APIs
export const getNearbyHelpers = async (longitude: number, latitude: number, radius: number = 10) => {
  return axios.get(`${HELPERS_API_URL}/helpers/nearby?longitude=${longitude}&latitude=${latitude}&radius=${radius}`);
};
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://shop.bitdottechnologies.com/api/';

const apiHandler = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 300000,
});

// Add token to request headers
apiHandler.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle API calls
export const apiRequest = async (method, endpoint, data = null) => {
  try {
    console.log('Making API request to', BASE_URL + endpoint); // Log full API URL
    const response = await apiHandler({
      method,
      url: endpoint,
      data,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with an error
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request was made but no response was received
      console.error('API Error: No response received', error.request);
    } else {
      // Something else happened
      console.error('API Error:', error.message);
    }
    throw error; // Rethrow the error for the caller to handle
  }
};

export default apiHandler;

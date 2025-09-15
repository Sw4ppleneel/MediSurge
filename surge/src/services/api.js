// src/services/api.js
// Centralized API service for all backend calls

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: getAuthHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// API functions for specific endpoints
export const api = {
  // Health check
  health: () => apiRequest('/'),

  // Authentication
  auth: {
    login: (credentials) => apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    signup: (userData) => apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
    logout: () => apiRequest('/auth/logout', { method: 'POST' }),
  },

  // Surge planning
  plan: {
    generate: (payload) => apiRequest('/plan', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
    // Add more plan-related endpoints as needed
    // get: (planId) => apiRequest(`/plan/${planId}`),
    // update: (planId, data) => apiRequest(`/plan/${planId}`, {
    //   method: 'PUT',
    //   body: JSON.stringify(data),
    // }),
  },

  // Add more API sections as your backend grows
  // inventory: {
  //   upload: (file) => { ... },
  //   list: () => { ... },
  // },
};

export default api;

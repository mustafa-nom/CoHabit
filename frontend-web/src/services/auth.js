import api from './api';

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    if (response.data?.data?.token) {
      localStorage.setItem('authToken', response.data.data.token);

      // Store user data from response
      if (response.data?.data) {
        const userData = {
          id: response.data.data.userId,
          username: response.data.data.username,
          displayName: response.data.data.displayName
        };
        localStorage.setItem('userData', JSON.stringify(userData));
      }
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data?.data?.token) {
      localStorage.setItem('authToken', response.data.data.token);

      // Store user data from response
      if (response.data?.data) {
        const userInfo = {
          id: response.data.data.userId,
          username: response.data.data.username,
          displayName: response.data.data.displayName
        };
        localStorage.setItem('userData', JSON.stringify(userInfo));
      }
    }
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
};

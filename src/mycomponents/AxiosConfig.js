// axiosConfig.js
import axios from 'axios';

axios.interceptors.request.use(
  (config) => {
    // Skip adding the Authorization header for the login request
    if (config.url !== '/login') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
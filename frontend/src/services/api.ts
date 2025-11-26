import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || 'Erro na operação';
      const detail = error.response.data?.detail || '';
      console.error('API Error:', message, detail);
      return Promise.reject(new Error(`${message}${detail ? ': ' + detail : ''}`));
    } else if (error.request) {
      // No response received
      console.error('Network Error:', error.message);
      return Promise.reject(new Error('Erro de conexão. Verifique se o backend está rodando.'));
    } else {
      // Other errors
      console.error('Error:', error.message);
      return Promise.reject(error);
    }
  }
);

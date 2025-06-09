import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:32769/api', // Adapter à ton backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ajouter ici un interceptor pour injecter un token JWT si besoin
// api.interceptors.request.use(...);

export default api;

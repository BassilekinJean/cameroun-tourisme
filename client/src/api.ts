import axios from 'axios';

import keycloak from './keycloak';

const apiClient = axios.create({
  baseURL: 'http://localhost:8081/api',
});

apiClient.interceptors.request.use(
  async (config) => {
    if (keycloak.authenticated) {
      // Met à jour le token si nécessaire
      await keycloak.updateToken(5);
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
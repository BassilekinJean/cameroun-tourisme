/**
 * Configuration API - Cameroun Tourisme
 * Ce fichier centralise toutes les configurations pour les appels API
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// URL de base de l'API backend
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// URL de base du serveur (sans /api)
export const SERVER_BASE_URL = API_BASE_URL.replace(/\/api$/, '');

/**
 * Transforme une URL de photo pour s'assurer qu'elle est complète
 * Les photos uploadées localement sont stockées dans /api/media/profiles/
 */
export const getPhotoUrl = (photoPath?: string | null): string | undefined => {
  if (!photoPath) return undefined;
  
  // Si c'est déjà une URL complète (http/https), la retourner telle quelle
  if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
    return photoPath;
  }
  
  // Si c'est un chemin relatif commençant par /profiles/, construire l'URL complète
  if (photoPath.startsWith('/profiles/') || photoPath.startsWith('profiles/')) {
    const cleanPath = photoPath.startsWith('/') ? photoPath : `/${photoPath}`;
    return `${API_BASE_URL}/media${cleanPath}`;
  }
  
  // Si c'est juste un nom de fichier, supposer qu'il est dans /profiles/
  if (!photoPath.includes('/')) {
    return `${API_BASE_URL}/media/profiles/${photoPath}`;
  }
  
  // Sinon, retourner tel quel (pourrait être un chemin d'image externe)
  return photoPath;
};

// Instance Axios configurée
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important pour les cookies HttpOnly (JWT)
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 secondes
});

// Flag pour éviter les boucles infinies de refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Intercepteur de requêtes
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Les tokens sont gérés automatiquement via cookies HttpOnly
    // Pas besoin d'ajouter manuellement le header Authorization
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponses pour gérer le refresh token automatique
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Ne pas tenter de refresh pour les endpoints d'authentification
    const authEndpoints = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'];
    const isAuthEndpoint = authEndpoints.some(endpoint => originalRequest.url?.includes(endpoint));

    // Si l'erreur est 401, que ce n'est pas un endpoint d'auth, et qu'on n'a pas encore essayé de refresh
    if (error.response?.status === 401 && !isAuthEndpoint && !originalRequest._retry) {
      if (isRefreshing) {
        // Si un refresh est déjà en cours, mettre la requête en file d'attente
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Tenter de rafraîchir le token
        await apiClient.post('/auth/refresh');
        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError);
        // Rediriger vers la page de login ou déclencher un événement
        window.dispatchEvent(new CustomEvent('auth:logout'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Types d'erreurs API
export interface ApiError {
  status: number;
  message: string;
  error: string;
  timestamp: string;
}

// Helper pour extraire le message d'erreur
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError;
    return apiError?.message || error.message || 'Une erreur est survenue';
  }
  return 'Une erreur inattendue est survenue';
};

export default apiClient;

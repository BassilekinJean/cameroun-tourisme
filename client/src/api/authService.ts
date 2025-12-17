/**
 * Service d'authentification - Cameroun Tourisme
 * Gère inscription, connexion, déconnexion et rafraîchissement de token
 */

import apiClient, { getErrorMessage } from './config';
import type { User, UserRegistrationData, UserLoginData, AuthResponse } from './types';

// Le backend utilise /api/auth pour l'authentification
const AUTH_BASE = '/auth';

/**
 * Inscription d'un nouvel utilisateur
 */
export const register = async (data: UserRegistrationData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<User>(`${AUTH_BASE}/register`, data);
    return {
      success: true,
      user: response.data,
      message: 'Inscription réussie',
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

/**
 * Connexion d'un utilisateur existant
 */
export const login = async (data: UserLoginData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<User>(`${AUTH_BASE}/login`, data);
    return {
      success: true,
      user: response.data,
      message: 'Connexion réussie',
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

/**
 * Déconnexion
 */
export const logout = async (): Promise<AuthResponse> => {
  try {
    await apiClient.post(`${AUTH_BASE}/logout`);
    return {
      success: true,
      message: 'Déconnexion réussie',
    };
  } catch (error) {
    // Même si l'appel échoue, on considère la déconnexion réussie côté client
    return {
      success: true,
      message: 'Déconnexion effectuée',
    };
  }
};

/**
 * Rafraîchir le token d'accès
 */
export const refreshToken = async (): Promise<boolean> => {
  try {
    await apiClient.post(`${AUTH_BASE}/refresh`);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Récupérer le profil de l'utilisateur connecté
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await apiClient.get<User>('/voyageurs/me');
    return response.data;
  } catch (error) {
    return null;
  }
};

/**
 * Vérifier si l'utilisateur est authentifié
 * Tente de récupérer le profil utilisateur
 */
export const checkAuth = async (): Promise<User | null> => {
  return getCurrentUser();
};

export default {
  register,
  login,
  logout,
  refreshToken,
  getCurrentUser,
  checkAuth,
};

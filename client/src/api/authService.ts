/**
 * Service d'authentification - Cameroun Tourisme
 * Gère inscription, connexion, déconnexion et rafraîchissement de token
 */

import apiClient, { getErrorMessage, getPhotoUrl } from './config';
import type { User, UserRegistrationData, UserLoginData, AuthResponse, UtilisateurDto, ApiResponse, EtablissementAuthDto } from './types';

// Le backend utilise /api/auth pour l'authentification
const AUTH_BASE = '/auth';

/**
 * Transforme UtilisateurDto (backend) en User (frontend)
 */
const transformUserResponse = (dto: UtilisateurDto): User => {
  return {
    id: dto.publicId,
    nomComplet: dto.nomComplet,
    email: dto.email,
    paysOrigine: dto.paysOrigine,
    photoProfile: getPhotoUrl(dto.photoProfile),
    favorisIds: dto.favorisIds || [],
    role: dto.role,
  };
};

/**
 * Transforme EtablissementAuthDto (backend) en User (frontend)
 * Permet une interface unifiée pour les utilisateurs et établissements
 */
const transformEtablissementResponse = (dto: EtablissementAuthDto): User => {
  return {
    id: dto.publicId,
    nomComplet: dto.nom,
    email: dto.email,
    photoProfile: getPhotoUrl(dto.photoProfile),
    favorisIds: [],
    role: dto.role,
  };
};

/**
 * Inscription d'un nouvel utilisateur
 */
export const register = async (data: UserRegistrationData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<UtilisateurDto>(`${AUTH_BASE}/register`, data);
    const user = transformUserResponse(response.data);
    return {
      success: true,
      user,
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
    const response = await apiClient.post<UtilisateurDto>(`${AUTH_BASE}/login`, data);
    const user = transformUserResponse(response.data);
    return {
      success: true,
      user,
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
 * Connexion d'un établissement
 */
export const loginEtablissement = async (data: UserLoginData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<EtablissementAuthDto>(`${AUTH_BASE}/etablissement/login`, data);
    const user = transformEtablissementResponse(response.data);
    return {
      success: true,
      user,
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
    const response = await apiClient.get<User>('/user/me');
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

// ==================== OTP FUNCTIONS ====================

/**
 * Envoyer un code OTP par email
 */
export const sendOtp = async (email: string): Promise<ApiResponse<{ message: string }>> => {
  try {
    const response = await apiClient.post<{ message: string; email: string }>(`${AUTH_BASE}/send-otp`, { email });
    return {
      success: true,
      data: response.data,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

/**
 * Vérifier un code OTP
 */
export const verifyOtp = async (email: string, otp: string): Promise<ApiResponse<{ message: string }>> => {
  try {
    const response = await apiClient.post<{ message: string }>(`${AUTH_BASE}/verify-otp`, { email, otp });
    return {
      success: true,
      data: response.data,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

/**
 * Demander une réinitialisation de mot de passe (envoie OTP)
 */
export const forgotPassword = async (email: string): Promise<ApiResponse<{ message: string }>> => {
  try {
    const response = await apiClient.post<{ message: string }>(`${AUTH_BASE}/forgot-password`, { email });
    return {
      success: true,
      data: response.data,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

/**
 * Réinitialiser le mot de passe avec code OTP
 */
export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string,
  confirmPassword: string
): Promise<ApiResponse<{ message: string }>> => {
  try {
    const response = await apiClient.post<{ message: string }>(`${AUTH_BASE}/reset-password`, {
      email,
      otp,
      newPassword,
      confirmPassword,
    });
    return {
      success: true,
      data: response.data,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

export default {
  register,
  login,
  loginEtablissement,
  logout,
  refreshToken,
  getCurrentUser,
  checkAuth,
  sendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
};

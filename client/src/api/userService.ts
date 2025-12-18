/**
 * Service Utilisateur/Voyageur - Cameroun Tourisme
 * Gère les opérations liées au profil utilisateur
 */

import apiClient, { getErrorMessage } from './config';
import type { User, UserUpdateData, ApiResponse, PageResponse } from './types';

const USER_BASE = '/user';

/**
 * Récupérer le profil de l'utilisateur connecté
 */
export const getMyProfile = async (): Promise<ApiResponse<User>> => {
  try {
    const response = await apiClient.get<User>(`${USER_BASE}/me`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

/**
 * Récupérer le profil d'un utilisateur par son publicId
 */
export const getUserProfile = async (publicId: string): Promise<ApiResponse<User>> => {
  try {
    const response = await apiClient.get<User>(`${USER_BASE}/${publicId}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

/**
 * Mettre à jour le profil utilisateur
 */
export const updateProfile = async (data: UserUpdateData): Promise<ApiResponse<User>> => {
  try {
    const response = await apiClient.put<User>(`${USER_BASE}/update`, data);
    return {
      success: true,
      data: response.data,
      message: 'Profil mis à jour avec succès',
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

/**
 * Mettre à jour la photo de profil utilisateur
 */
export const updateProfilePhoto = async (file: File): Promise<ApiResponse<{ url: string }>> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post<{ url: string }>(`${USER_BASE}/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return {
      success: true,
      data: response.data,
      message: 'Photo de profil mise à jour avec succès',
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

/**
 * Ajouter/Retirer un établissement des favoris
 */
export const toggleFavori = async (etablissementId: string): Promise<ApiResponse<void>> => {
  try {
    await apiClient.patch(`${USER_BASE}/addFavoris/${etablissementId}`);
    return {
      success: true,
      message: 'Favoris mis à jour',
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

/**
 * Récupérer tous les utilisateurs (admin)
 */
export const getAllUsers = async (
  page: number = 0,
  size: number = 10,
  sortBy: string = 'dateInscription',
  direction: 'asc' | 'desc' = 'desc'
): Promise<ApiResponse<PageResponse<User>>> => {
  try {
    const response = await apiClient.get<PageResponse<User>>(`${USER_BASE}/all`, {
      params: { page, size, sort: sortBy, sortDir: direction },
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

/**
 * Envoyer un code OTP pour le changement de mot de passe
 */
export const sendPasswordChangeOtp = async (): Promise<ApiResponse<{ message: string; email: string }>> => {
  try {
    const response = await apiClient.post<{ message: string; email: string }>(`${USER_BASE}/send-password-change-otp`);
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
 * Changer le mot de passe avec vérification OTP
 */
export const changePasswordWithOtp = async (
  newPassword: string,
  validatePassword: string,
  otp: string
): Promise<ApiResponse<{ message: string }>> => {
  try {
    const response = await apiClient.post<{ message: string }>(
      `${USER_BASE}/change-password`,
      { newPassword, validatePassword },
      { params: { otp } }
    );
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
  getMyProfile,
  getUserProfile,
  updateProfile,
  updateProfilePhoto,
  toggleFavori,
  getAllUsers,
  sendPasswordChangeOtp,
  changePasswordWithOtp,
};

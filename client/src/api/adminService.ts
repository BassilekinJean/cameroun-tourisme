/**
 * Service Administration - Cameroun Tourisme
 * Gère les opérations d'administration (Users, Avis, Établissements)
 */

import apiClient, { getErrorMessage } from './config';
import type {
  User,
  Avis,
  Etablissement,
  EtablissementListItem,
  ApiResponse,
  PageResponse,
  AdminStats,
  AdminUpdateUserData,
  AdminUpdateEtablissementData,
  AdminCreateEtablissementData,
} from './types';

const ADMIN_BASE = '/admin';

// ==================== STATISTIQUES ====================

/**
 * Récupérer les statistiques globales du site
 */
export const getAdminStats = async (): Promise<ApiResponse<AdminStats>> => {
  try {
    const response = await apiClient.get<AdminStats>(`${ADMIN_BASE}/stats`);
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

// ==================== GESTION DES UTILISATEURS ====================

/**
 * Récupérer tous les utilisateurs (paginé)
 */
export const getAllUsers = async (
  page: number = 0,
  size: number = 10,
  sort: string = 'dateCreation',
  sortDir: 'asc' | 'desc' = 'desc',
  search?: string
): Promise<ApiResponse<PageResponse<User>>> => {
  try {
    const response = await apiClient.get<PageResponse<User>>(`${ADMIN_BASE}/users`, {
      params: { page, size, sort, sortDir, search },
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
 * Récupérer un utilisateur par son publicId
 */
export const getUserById = async (publicId: string): Promise<ApiResponse<User>> => {
  try {
    const response = await apiClient.get<User>(`${ADMIN_BASE}/users/${publicId}`);
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
 * Mettre à jour un utilisateur
 */
export const updateUser = async (
  publicId: string,
  data: AdminUpdateUserData
): Promise<ApiResponse<User>> => {
  try {
    const response = await apiClient.put<User>(`${ADMIN_BASE}/users/${publicId}`, data);
    return {
      success: true,
      data: response.data,
      message: 'Utilisateur mis à jour avec succès',
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

/**
 * Changer le rôle d'un utilisateur
 */
export const updateUserRole = async (
  publicId: string,
  role: string
): Promise<ApiResponse<User>> => {
  try {
    const response = await apiClient.patch<User>(`${ADMIN_BASE}/users/${publicId}/role`, null, {
      params: { role },
    });
    return {
      success: true,
      data: response.data,
      message: 'Rôle mis à jour avec succès',
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

/**
 * Verrouiller/Déverrouiller un compte
 */
export const toggleUserLock = async (
  publicId: string
): Promise<ApiResponse<{ locked: boolean }>> => {
  try {
    const response = await apiClient.patch<{ message: string; locked: string }>(
      `${ADMIN_BASE}/users/${publicId}/lock`
    );
    return {
      success: true,
      data: { locked: response.data.locked === 'true' },
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
 * Supprimer un utilisateur
 */
export const deleteUser = async (publicId: string): Promise<ApiResponse<void>> => {
  try {
    await apiClient.delete(`${ADMIN_BASE}/users/${publicId}`);
    return {
      success: true,
      message: 'Utilisateur supprimé avec succès',
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

/**
 * Supprimer plusieurs utilisateurs
 */
export const deleteUsersBatch = async (
  userIds: string[]
): Promise<ApiResponse<{ deleted: number }>> => {
  try {
    const response = await apiClient.delete<{ deleted: number }>(`${ADMIN_BASE}/users/batch`, {
      data: userIds,
    });
    return {
      success: true,
      data: response.data,
      message: `${response.data.deleted} utilisateur(s) supprimé(s)`,
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

// ==================== GESTION DES ÉTABLISSEMENTS ====================

/**
 * Récupérer tous les établissements (admin, paginé)
 */
export const getAllEtablissementsAdmin = async (
  page: number = 0,
  size: number = 10,
  sort: string = 'createdAt',
  sortDir: 'asc' | 'desc' = 'desc',
  search?: string
): Promise<ApiResponse<PageResponse<EtablissementListItem>>> => {
  try {
    const response = await apiClient.get<PageResponse<EtablissementListItem>>(
      `${ADMIN_BASE}/etablissements`,
      { params: { page, size, sort, sortDir, search } }
    );
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
 * Créer un nouvel établissement (admin uniquement)
 */
export const createEtablissement = async (
  data: AdminCreateEtablissementData
): Promise<ApiResponse<EtablissementListItem>> => {
  try {
    const response = await apiClient.post<EtablissementListItem>(
      `${ADMIN_BASE}/etablissements`,
      data
    );
    return {
      success: true,
      data: response.data,
      message: 'Établissement créé avec succès',
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

/**
 * Mettre à jour un établissement
 */
export const updateEtablissement = async (
  publicId: string,
  data: AdminUpdateEtablissementData
): Promise<ApiResponse<EtablissementListItem>> => {
  try {
    const response = await apiClient.put<EtablissementListItem>(
      `${ADMIN_BASE}/etablissements/${publicId}`,
      data
    );
    return {
      success: true,
      data: response.data,
      message: 'Établissement mis à jour avec succès',
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

/**
 * Supprimer un établissement
 */
export const deleteEtablissement = async (publicId: string): Promise<ApiResponse<void>> => {
  try {
    await apiClient.delete(`${ADMIN_BASE}/etablissements/${publicId}`);
    return {
      success: true,
      message: 'Établissement supprimé avec succès',
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

// ==================== GESTION DES AVIS ====================

/**
 * Récupérer tous les avis (admin, paginé)
 */
export const getAllAvisAdmin = async (
  page: number = 0,
  size: number = 10,
  sort: string = 'dateCreation',
  sortDir: 'asc' | 'desc' = 'desc',
  search?: string
): Promise<ApiResponse<PageResponse<Avis>>> => {
  try {
    const response = await apiClient.get<PageResponse<Avis>>(`${ADMIN_BASE}/avis`, {
      params: { page, size, sort, sortDir, search },
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
 * Supprimer un avis (modération)
 */
export const deleteAvisAdmin = async (publicId: string): Promise<ApiResponse<void>> => {
  try {
    await apiClient.delete(`${ADMIN_BASE}/avis/${publicId}`);
    return {
      success: true,
      message: 'Avis supprimé avec succès',
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

/**
 * Supprimer plusieurs avis
 */
export const deleteAvisBatch = async (
  avisIds: string[]
): Promise<ApiResponse<{ deleted: number }>> => {
  try {
    const response = await apiClient.delete<{ deleted: number }>(`${ADMIN_BASE}/avis/batch`, {
      data: avisIds,
    });
    return {
      success: true,
      data: response.data,
      message: `${response.data.deleted} avis supprimé(s)`,
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

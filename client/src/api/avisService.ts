/**
 * Service Avis - Cameroun Tourisme
 * Gère les opérations liées aux avis/commentaires
 */

import apiClient, { getErrorMessage } from './config';
import type { Avis, AvisCreationData, AvisUpdateData, ApiResponse, PageResponse } from './types';

const AVIS_BASE = '/avis';
const LIEUX_BASE = '/lieux';

/**
 * Récupérer un avis par son publicId
 */
export const getAvisById = async (publicId: string): Promise<ApiResponse<Avis>> => {
  try {
    const response = await apiClient.get<Avis>(`${AVIS_BASE}/${publicId}`);
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
 * Récupérer tous les avis d'un établissement (paginé)
 */
export const getAvisByEtablissement = async (
  etablissementId: string,
  page: number = 0,
  size: number = 10,
  sortBy: string = 'dateCreation',
  direction: 'asc' | 'desc' = 'desc'
): Promise<ApiResponse<PageResponse<Avis>>> => {
  try {
    const response = await apiClient.get<PageResponse<Avis>>(`${AVIS_BASE}/all`, {
      params: { etablissementId, page, size, sortBy, direction },
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
 * Récupérer tous les avis d'un utilisateur (paginé)
 */
export const getAvisByUser = async (
  userPublicId: string,
  page: number = 0,
  size: number = 10,
  sortBy: string = 'dateCreation',
  direction: 'asc' | 'desc' = 'desc'
): Promise<ApiResponse<PageResponse<Avis>>> => {
  try {
    const response = await apiClient.get<PageResponse<Avis>>(`${AVIS_BASE}/user/${userPublicId}`, {
      params: { page, size, sortBy, direction },
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
 * Créer un nouvel avis sur un établissement
 * Utilise l'endpoint POST /api/lieux/{publicId}/post-avis
 */
export const createAvis = async (
  etablissementPublicId: string,
  data: AvisCreationData
): Promise<ApiResponse<void>> => {
  try {
    await apiClient.post(`${LIEUX_BASE}/${etablissementPublicId}/post-avis`, data);
    return {
      success: true,
      message: 'Avis publié avec succès',
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

/**
 * Mettre à jour un avis existant
 */
export const updateAvis = async (
  avisPublicId: string,
  data: AvisUpdateData
): Promise<ApiResponse<void>> => {
  try {
    await apiClient.put(`${AVIS_BASE}/update`, {
      publicId: avisPublicId,
      ...data,
    });
    return {
      success: true,
      message: 'Avis mis à jour avec succès',
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

/**
 * Supprimer un avis
 */
export const deleteAvis = async (publicId: string): Promise<ApiResponse<void>> => {
  try {
    await apiClient.delete(`${AVIS_BASE}/${publicId}`);
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
 * Liker/Unliker un avis (toggle)
 */
export const toggleAvisLike = async (publicId: string): Promise<ApiResponse<void>> => {
  try {
    await apiClient.patch(`${AVIS_BASE}/toggle-favori/${publicId}`);
    return {
      success: true,
      message: 'Like mis à jour',
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

export default {
  getAvisById,
  getAvisByEtablissement,
  getAvisByUser,
  createAvis,
  updateAvis,
  deleteAvis,
  toggleAvisLike,
};

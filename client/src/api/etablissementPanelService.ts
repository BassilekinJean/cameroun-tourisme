/**
 * Service Panel Établissement - Cameroun Tourisme
 * Gère les opérations pour les gestionnaires d'établissements
 */

import apiClient, { getErrorMessage } from './config';
import type {
  Avis,
  Etablissement,
  ApiResponse,
  PageResponse,
  EtablissementUpdateData,
  EtablissementPanelStats,
} from './types';

const PANEL_BASE = '/etablissement-panel';

/**
 * Récupérer les informations de mon établissement
 */
export const getMyEtablissement = async (): Promise<ApiResponse<Etablissement>> => {
  try {
    const response = await apiClient.get<Etablissement>(`${PANEL_BASE}/my-etablissement`);
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
 * Récupérer les statistiques de l'établissement
 */
export const getEtablissementStats = async (): Promise<ApiResponse<EtablissementPanelStats>> => {
  try {
    const response = await apiClient.get<EtablissementPanelStats>(`${PANEL_BASE}/stats`);
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
 * Mettre à jour les informations de l'établissement
 */
export const updateMyEtablissement = async (
  data: EtablissementUpdateData
): Promise<ApiResponse<Etablissement>> => {
  try {
    const response = await apiClient.put<Etablissement>(`${PANEL_BASE}/update`, data);
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
 * Récupérer les avis de mon établissement
 */
export const getMyEtablissementAvis = async (
  page: number = 0,
  size: number = 10,
  sort: string = 'dateCreation',
  sortDir: 'asc' | 'desc' = 'desc'
): Promise<ApiResponse<PageResponse<Avis>>> => {
  try {
    const response = await apiClient.get<PageResponse<Avis>>(`${PANEL_BASE}/avis`, {
      params: { page, size, sort, sortDir },
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
 * Signaler un avis pour modération
 */
export const reportAvis = async (
  avisPublicId: string,
  reason?: string
): Promise<ApiResponse<{ message: string }>> => {
  try {
    const response = await apiClient.delete<{ message: string; avisId: string }>(
      `${PANEL_BASE}/avis/${avisPublicId}`,
      { params: { reason } }
    );
    return {
      success: true,
      data: { message: response.data.message },
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

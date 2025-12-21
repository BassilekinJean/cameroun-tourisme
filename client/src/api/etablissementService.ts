/**
 * Service Établissement - Cameroun Tourisme
 * Gère les opérations liées aux établissements (hôtels, restaurants, sites)
 */

import apiClient, { getErrorMessage } from './config';
import { TypeLieu } from './types';
import type {
  Etablissement,
  EtablissementListItem,
  EtablissementRegistrationData,
  ApiResponse,
  PageResponse,
  SearchParams,
  SearchResult,
  EtablissementCategorie,
} from './types';

const LIEUX_BASE = '/lieux';

/**
 * Récupérer tous les établissements (paginé)
 */
export const getAllEtablissements = async (
  page: number = 0,
  size: number = 12,
  categorie?: TypeLieu | EtablissementCategorie
): Promise<ApiResponse<PageResponse<EtablissementListItem>>> => {
  try {
    const response = await apiClient.get<PageResponse<EtablissementListItem>>(LIEUX_BASE, {
      params: { page, size, categorie },
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
 * Récupérer un établissement par son publicId
 */
export const getEtablissementById = async (publicId: string): Promise<ApiResponse<Etablissement>> => {
  try {
    const response = await apiClient.get<Etablissement>(`${LIEUX_BASE}/${publicId}`);
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
 * Rechercher des établissements
 */
export const searchEtablissements = async (params: SearchParams): Promise<ApiResponse<SearchResult>> => {
  try {
    const response = await apiClient.get<SearchResult>(`${LIEUX_BASE}/search`, {
      params: {
        q: params.query,
        categorie: params.categorie,
        ville: params.ville,
        page: params.page || 0,
        size: params.size || 12,
        sort: params.sort,
      },
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
 * Récupérer les établissements par catégorie
 */
export const getEtablissementsByCategorie = async (
  categorie: TypeLieu | EtablissementCategorie,
  page: number = 0,
  size: number = 12
): Promise<ApiResponse<PageResponse<EtablissementListItem>>> => {
  try {
    const response = await apiClient.get<PageResponse<EtablissementListItem>>(
      `${LIEUX_BASE}/categorie/${categorie}`,
      { params: { page, size } }
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
 * Récupérer les établissements par ville
 */
export const getEtablissementsByVille = async (
  ville: string,
  page: number = 0,
  size: number = 12
): Promise<ApiResponse<PageResponse<EtablissementListItem>>> => {
  try {
    const response = await apiClient.get<PageResponse<EtablissementListItem>>(
      `${LIEUX_BASE}/ville/${encodeURIComponent(ville)}`,
      { params: { page, size } }
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
 * Enregistrer un nouvel établissement
 */
export const registerEtablissement = async (
  data: EtablissementRegistrationData
): Promise<ApiResponse<Etablissement>> => {
  try {
    const response = await apiClient.post<Etablissement>(`${LIEUX_BASE}/register`, data);
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
 * Récupérer les hôtels
 */
export const getHotels = async (
  page: number = 0,
  size: number = 12
): Promise<ApiResponse<PageResponse<EtablissementListItem>>> => {
  return getEtablissementsByCategorie(TypeLieu.HOTEL, page, size);
};

/**
 * Récupérer les restaurants
 */
export const getRestaurants = async (
  page: number = 0,
  size: number = 12
): Promise<ApiResponse<PageResponse<EtablissementListItem>>> => {
  return getEtablissementsByCategorie(TypeLieu.RESTAURATION, page, size);
};

/**
 * Récupérer les sites touristiques
 */
export const getSitesTouristiques = async (
  page: number = 0,
  size: number = 12
): Promise<ApiResponse<PageResponse<EtablissementListItem>>> => {
  return getEtablissementsByCategorie(TypeLieu.SITE_TOURISTIQUE, page, size);
};

/**
 * Récupérer les établissements populaires (avec le plus d'avis)
 */
export const getPopularEtablissements = async (
  size: number = 6
): Promise<ApiResponse<EtablissementListItem[]>> => {
  try {
    const response = await apiClient.get<EtablissementListItem[]>(`${LIEUX_BASE}/popular`, {
      params: { size },
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

export default {
  getAllEtablissements,
  getEtablissementById,
  searchEtablissements,
  getEtablissementsByCategorie,
  getEtablissementsByVille,
  registerEtablissement,
  getHotels,
  getRestaurants,
  getSitesTouristiques,
  getPopularEtablissements,
};

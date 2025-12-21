import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getAllEtablissements,
  getEtablissementById,
  searchEtablissements,
  getEtablissementsByCategorie,
  getEtablissementsByVille,
  getHotels,
  getPopularEtablissements,
} from '../etablissementService';
import apiClient from '../config';
import { TypeLieu } from '../types';

// Mock apiClient
vi.mock('../config', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
  getErrorMessage: (error: unknown) => {
    if (error instanceof Error) return error.message;
    return 'Une erreur est survenue';
  },
}));

describe('etablissementService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getAllEtablissements', () => {
    it('should return successfully with data', async () => {
      const mockResponse = {
        content: [{ id: '1', name: 'Hotel 1' }],
        totalPages: 1,
      };
      vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockResponse });

      const result = await getAllEtablissements(0, 10);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResponse);
      expect(apiClient.get).toHaveBeenCalledWith('/lieux', {
        params: { page: 0, size: 10, categorie: undefined },
      });
    });

    it('should handle errors gracefully', async () => {
      vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('Network error'));

      const result = await getAllEtablissements();

      expect(result.success).toBe(false);
      expect(result.message).toBe('Network error');
    });
  });

  describe('getEtablissementById', () => {
    it('should return etablissement details', async () => {
      const mockEtab = { publicId: '123', nom: 'Super Hotel' };
      vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockEtab });

      const result = await getEtablissementById('123');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockEtab);
      expect(apiClient.get).toHaveBeenCalledWith('/lieux/123');
    });
  });

  describe('searchEtablissements', () => {
    it('should call search endpoint with correct params', async () => {
      const mockResponse = { content: [] };
      vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockResponse });

      const params = { query: 'test', ville: 'Douala', page: 1 };
      await searchEtablissements(params);

      expect(apiClient.get).toHaveBeenCalledWith('/lieux/search', {
        params: {
          q: 'test',
          ville: 'Douala',
          categorie: undefined,
          page: 1,
          size: 12,
          sort: undefined,
        },
      });
    });
  });

  describe('getEtablissementsByCategorie', () => {
    it('should fetch by category', async () => {
      const mockResponse = { content: [] };
      vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockResponse });

      await getEtablissementsByCategorie(TypeLieu.HOTEL);

      expect(apiClient.get).toHaveBeenCalledWith(`/lieux/categorie/${TypeLieu.HOTEL}`, {
        params: { page: 0, size: 12 },
      });
    });
  });

  describe('getEtablissementsByVille', () => {
    it('should fetch by city with encoded url', async () => {
      const mockResponse = { content: [] };
      vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockResponse });

      await getEtablissementsByVille('Yaoundé');

      expect(apiClient.get).toHaveBeenCalledWith('/lieux/ville/Yaound%C3%A9', {
        params: { page: 0, size: 12 },
      });
    });
  });

  describe('getHotels', () => {
    it('should supply HOTEL category automatically', async () => {
      const mockResponse = { content: [] };
      vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockResponse });

      await getHotels(0, 5);

      expect(apiClient.get).toHaveBeenCalledWith(`/lieux/categorie/${TypeLieu.HOTEL}`, {
        params: { page: 0, size: 5 },
      });
    });
  });

  describe('getPopularEtablissements', () => {
    it('should fetch popular places', async () => {
      const mockResponse = [{ id: '1' }, { id: '2' }];
      vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockResponse });

      const result = await getPopularEtablissements(3);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResponse);
      expect(apiClient.get).toHaveBeenCalledWith('/lieux/popular', {
        params: { size: 3 },
      });
    });
  });
});

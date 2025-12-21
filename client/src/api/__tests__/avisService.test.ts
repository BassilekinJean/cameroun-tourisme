import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getAvisById,
  getAvisByEtablissement,
  getAvisByUser,
  createAvis,
  updateAvis,
  deleteAvis,
  toggleAvisLike,
} from '../avisService';
import apiClient from '../config';

// Mock apiClient
vi.mock('../config', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  },
  getErrorMessage: (error: unknown) => {
    if (error instanceof Error) return error.message;
    return 'Une erreur est survenue';
  },
}));

describe('avisService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getAvisById', () => {
    it('should return avis details', async () => {
      const mockAvis = { publicId: 'avis-1', note: 4, commentaire: 'Super' };
      vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockAvis });

      const result = await getAvisById('avis-1');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockAvis);
      expect(apiClient.get).toHaveBeenCalledWith('/avis/avis-1');
    });

    it('should handle errors', async () => {
      vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('Not found'));

      const result = await getAvisById('unknown');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Not found');
    });
  });

  describe('getAvisByEtablissement', () => {
    it('should fetch avis for establishment', async () => {
      const mockResponse = { content: [], totalPages: 0 };
      vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockResponse });

      await getAvisByEtablissement('etab-1', 1, 5, 'note', 'asc');

      expect(apiClient.get).toHaveBeenCalledWith('/avis/all', {
        params: {
          etablissementId: 'etab-1',
          page: 1,
          size: 5,
          sortBy: 'note',
          direction: 'asc',
        },
      });
    });
  });

  describe('getAvisByUser', () => {
    it('should fetch avis for user', async () => {
      const mockResponse = { content: [] };
      vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockResponse });

      await getAvisByUser('user-1');

      expect(apiClient.get).toHaveBeenCalledWith('/avis/user', {
        params: {
          userId: 'user-1',
          page: 0,
          size: 10,
          sort: 'dateCreation',
          sortDir: 'desc',
        },
      });
    });
  });

  describe('createAvis', () => {
    it('should post new avis', async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce({});

      const data = { note: 5, commentaire: 'Top' };
      const result = await createAvis('etab-1', data);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Avis publié avec succès');
      expect(apiClient.post).toHaveBeenCalledWith('/lieux/etab-1/post-avis', data);
    });
  });

  describe('updateAvis', () => {
    it('should update existing avis', async () => {
      vi.mocked(apiClient.put).mockResolvedValueOnce({});

      const data = { note: 3, commentaire: 'Moyen' };
      const result = await updateAvis('avis-1', data);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Avis mis à jour avec succès');
      expect(apiClient.put).toHaveBeenCalledWith('/avis/update', {
        publicId: 'avis-1',
        ...data,
      });
    });
  });

  describe('deleteAvis', () => {
    it('should delete avis', async () => {
      vi.mocked(apiClient.delete).mockResolvedValueOnce({});

      const result = await deleteAvis('avis-1');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Avis supprimé avec succès');
      expect(apiClient.delete).toHaveBeenCalledWith('/avis/avis-1/del');
    });
  });

  describe('toggleAvisLike', () => {
    it('should toggle like', async () => {
      vi.mocked(apiClient.patch).mockResolvedValueOnce({});

      const result = await toggleAvisLike('avis-1');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Like mis à jour');
      expect(apiClient.patch).toHaveBeenCalledWith('/avis/toggle-favori/avis-1');
    });
  });
});

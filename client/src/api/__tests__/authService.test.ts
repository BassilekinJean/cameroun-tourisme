import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  login,
  register,
  logout,
  sendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
  loginEtablissement,
} from '../authService';
import apiClient from '../config';

// Mock apiClient
vi.mock('../config', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
  getErrorMessage: (error: unknown) => {
    if (error instanceof Error) return error.message;
    return 'Une erreur est survenue';
  },
  getPhotoUrl: (url: string | null | undefined) => url || null,
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('login', () => {
    it('should return success with user data on successful login', async () => {
      const mockUserDto = {
        publicId: 'user-123',
        nomComplet: 'Jean Dupont',
        email: 'jean@example.com',
        paysOrigine: 'Cameroun',
        photoProfile: null,
        favorisIds: [],
        role: 'USER',
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce({ data: mockUserDto });

      const result = await login({ email: 'jean@example.com', password: 'password123' });

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe('jean@example.com');
      expect(result.user?.nomComplet).toBe('Jean Dupont');
      expect(result.message).toBe('Connexion réussie');
    });

    it('should return failure on login error', async () => {
      vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Invalid credentials'));

      const result = await login({ email: 'jean@example.com', password: 'wrong' });

      expect(result.success).toBe(false);
      expect(result.user).toBeUndefined();
      expect(result.message).toBe('Invalid credentials');
    });
  });

  describe('register', () => {
    it('should return success on successful registration', async () => {
      const mockUserDto = {
        publicId: 'user-456',
        nomComplet: 'Marie Durand',
        email: 'marie@example.com',
        paysOrigine: 'France',
        photoProfile: null,
        favorisIds: [],
        role: 'USER',
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce({ data: mockUserDto });

      const result = await register({
        nomComplet: 'Marie Durand',
        email: 'marie@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        paysOrigine: 'France',
      });

      expect(result.success).toBe(true);
      expect(result.user?.email).toBe('marie@example.com');
      expect(result.message).toBe('Inscription réussie');
    });

    it('should return failure on registration error', async () => {
      vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Email already exists'));

      const result = await register({
        nomComplet: 'Marie Durand',
        email: 'existing@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        paysOrigine: 'France',
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe('Email already exists');
    });
  });

  describe('logout', () => {
    it('should return success even if API call fails', async () => {
      vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Network error'));

      const result = await logout();

      expect(result.success).toBe(true);
      expect(result.message).toBe('Déconnexion effectuée');
    });

    it('should return success on successful logout', async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce({});

      const result = await logout();

      expect(result.success).toBe(true);
      expect(result.message).toBe('Déconnexion réussie');
    });
  });

  describe('loginEtablissement', () => {
    it('should return success with establishment data', async () => {
      const mockEtablissementDto = {
        publicId: 'etab-123',
        nom: 'Hotel Cameroun',
        email: 'hotel@example.com',
        photoProfile: null,
        role: 'ETABLISSEMENT',
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce({ data: mockEtablissementDto });

      const result = await loginEtablissement({ email: 'hotel@example.com', password: 'password123' });

      expect(result.success).toBe(true);
      expect(result.user?.nomComplet).toBe('Hotel Cameroun');
      expect(result.user?.role).toBe('ETABLISSEMENT');
    });
  });

  describe('sendOtp', () => {
    it('should return success on OTP sent', async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce({
        data: { message: 'OTP envoyé', email: 'jean@example.com' },
      });

      const result = await sendOtp('jean@example.com');

      expect(result.success).toBe(true);
      expect(result.message).toBe('OTP envoyé');
    });

    it('should return failure on error', async () => {
      vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Email not found'));

      const result = await sendOtp('unknown@example.com');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Email not found');
    });
  });

  describe('verifyOtp', () => {
    it('should return success on valid OTP', async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce({
        data: { message: 'OTP vérifié' },
      });

      const result = await verifyOtp('jean@example.com', '123456');

      expect(result.success).toBe(true);
      expect(result.message).toBe('OTP vérifié');
    });

    it('should return failure on invalid OTP', async () => {
      vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Invalid OTP'));

      const result = await verifyOtp('jean@example.com', '000000');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid OTP');
    });
  });

  describe('forgotPassword', () => {
    it('should return success when reset email is sent', async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce({
        data: { message: 'Email de réinitialisation envoyé' },
      });

      const result = await forgotPassword('jean@example.com');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Email de réinitialisation envoyé');
    });
  });

  describe('resetPassword', () => {
    it('should return success on password reset', async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce({
        data: { message: 'Mot de passe réinitialisé' },
      });

      const result = await resetPassword(
        'jean@example.com',
        '123456',
        'newPassword123',
        'newPassword123'
      );

      expect(result.success).toBe(true);
      expect(result.message).toBe('Mot de passe réinitialisé');
    });

    it('should return failure on reset error', async () => {
      vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Invalid OTP'));

      const result = await resetPassword(
        'jean@example.com',
        '000000',
        'newPassword123',
        'newPassword123'
      );

      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid OTP');
    });
  });
});

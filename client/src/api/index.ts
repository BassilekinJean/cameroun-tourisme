/**
 * Point d'entrée des services API - Cameroun Tourisme
 * Exporte tous les services et types pour une utilisation simplifiée
 */

// Configuration
export { default as apiClient, getErrorMessage, API_BASE_URL } from './config';
export type { ApiError } from './config';

// Types
export * from './types';

// Services
export { default as authService } from './authService';
export { default as userService } from './userService';
export { default as etablissementService } from './etablissementService';
export { default as avisService } from './avisService';

// Fonctions individuelles pour import destructuré
export {
  register,
  login,
  logout,
  refreshToken,
  getCurrentUser,
  checkAuth,
} from './authService';

export {
  getMyProfile,
  getUserProfile,
  updateProfile,
  toggleFavori,
  getAllUsers,
} from './userService';

export {
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
} from './etablissementService';

export {
  getAvisById,
  getAvisByEtablissement,
  getAvisByUser,
  createAvis,
  updateAvis,
  deleteAvis,
  toggleAvisLike,
} from './avisService';

// Services Admin
export {
  getAdminStats,
  getAllUsers as getAllUsersAdmin,
  getUserById,
  updateUser,
  updateUserRole,
  toggleUserLock,
  deleteUser,
  deleteUsersBatch,
  getAllEtablissementsAdmin,
  createEtablissement,
  updateEtablissement,
  deleteEtablissement,
  getAllAvisAdmin,
  deleteAvisAdmin,
  deleteAvisBatch,
} from './adminService';

// Services Panel Établissement
export {
  getMyEtablissement,
  getEtablissementStats,
  updateMyEtablissement,
  getMyEtablissementAvis,
  reportAvis,
} from './etablissementPanelService';

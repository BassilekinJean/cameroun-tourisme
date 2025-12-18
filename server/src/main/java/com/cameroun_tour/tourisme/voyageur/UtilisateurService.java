package com.cameroun_tour.tourisme.voyageur;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import com.cameroun_tour.tourisme.common.contracts.AdminUpdateUserRequest;
import com.cameroun_tour.tourisme.common.contracts.AdminUserDto;
import com.cameroun_tour.tourisme.common.utils.enums.Role;
import com.cameroun_tour.tourisme.voyageur.model.UtilisateurUpdatePasswordDto;
import com.cameroun_tour.tourisme.voyageur.model.UtilisateurDto;


public interface UtilisateurService {

    void toggleFavori(UUID userPublicId, UUID etablissementPublicId);
    
    void deleteAccountWithId(Long id);

    UtilisateurDto getUserProfile(UUID id);

    void updateUserProfile(UtilisateurDto userProfile, String email);

    void updatePassword(UtilisateurUpdatePasswordDto userPasswordDto, String email);
    
    void updatePassword(String email, String newPassword);
    
    String updateProfilePhoto(String email, MultipartFile file) throws Exception;

    UtilisateurEntity findByPublicId(UUID id);

    UtilisateurEntity findByEmail(String email);
    
    Page<UtilisateurEntity> getAllUser(int page, int size, String sortBy, String sortDir);

    // ==================== MÉTHODES ADMIN ====================

    /**
     * Compte total des utilisateurs
     */
    long countAll();

    /**
     * Recherche paginée des utilisateurs avec recherche textuelle optionnelle
     */
    Page<AdminUserDto> searchUsersForAdmin(int page, int size, String sort, String sortDir, String search);

    /**
     * Récupère un utilisateur par son ID public pour l'admin
     */
    AdminUserDto getUserByPublicIdForAdmin(UUID publicId);

    /**
     * Met à jour un utilisateur (admin)
     */
    AdminUserDto updateUserForAdmin(UUID publicId, AdminUpdateUserRequest request);

    /**
     * Change le rôle d'un utilisateur
     */
    AdminUserDto updateUserRole(UUID publicId, Role role);

    /**
     * Verrouille/Déverrouille un compte utilisateur
     */
    boolean toggleUserLock(UUID publicId);

    /**
     * Supprime un utilisateur par son ID public
     */
    void deleteUserByPublicId(UUID publicId);

    /**
     * Suppression en lot d'utilisateurs
     */
    int deleteUsersBatch(List<UUID> userIds);
}

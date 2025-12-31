package com.cameroun_tour.tourisme.voyageur.api;

import static java.util.Objects.requireNonNull;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cameroun_tour.tourisme.common.contracts.AdminUpdateUserRequest;
import com.cameroun_tour.tourisme.common.contracts.AdminUserDto;
import com.cameroun_tour.tourisme.common.utils.enums.Role;
import com.cameroun_tour.tourisme.voyageur.UtilisateurService;
import com.cameroun_tour.tourisme.voyageur.UtilisateurEntity;
import com.cameroun_tour.tourisme.voyageur.errors.UserNotFoundException;
import com.cameroun_tour.tourisme.voyageur.events.FavoriToggledEvent;
import com.cameroun_tour.tourisme.voyageur.model.UtilisateurUpdatePasswordDto;
import com.cameroun_tour.tourisme.voyageur.model.UtilisateurDto;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Tag(name = "User Service", description = "Logique Métier de gestion des comptes utilisateurs")
public class UtilisateurServiceImpl implements UtilisateurService {

    private final UtilisateurRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final PasswordEncoder passwordEncoder;
    

    @Override
    @Transactional
    public void deleteAccountWithId(Long id) {
        UtilisateurEntity userToDelete = this.userRepository.findById(requireNonNull(id))
                                                    .orElseThrow(() -> 
                                                    new UserNotFoundException("Aucun utilisateur trouver"));

        userRepository.deleteById(requireNonNull(userToDelete.getId()));
    }

    @Override
    @Transactional(readOnly = true)
    public UtilisateurDto getUserProfile(UUID id){
        UtilisateurEntity u = userRepository.findByPublicId(id)
                .orElseThrow(() -> new UserNotFoundException("Aucun utilisateur trouvé"));

        return new UtilisateurDto(u.getPublicId(), 
                                  u.getNomComplet(),
                                  u.getUserEmail(),
                                  u.getPaysOrigine(),
                                  u.getPhotoProfile(),
                                  u.getFavorisIds(), // Directement les UUIDs
                                  u.getRole()); // Ajouter le rôle
    }


    @Override
    @Transactional
    public void updateUserProfile(UtilisateurDto userProfile, String email){

        Optional<UtilisateurEntity> userOpt = userRepository.findByUserEmail(email);

        if (userOpt.isEmpty()) {
            throw new UserNotFoundException("Aucun utilisateur trouvé");
        }
        UtilisateurEntity user = userOpt.get();
        user.setNomComplet(userProfile.nomComplet());
        user.setPaysOrigine(userProfile.paysOrigine());
        user.setUserEmail(userProfile.email());
        user.setPhotoProfile(userProfile.photoProfile());

        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UtilisateurEntity findByEmail(String email){

        Optional <UtilisateurEntity> utilisateur = this.userRepository.findByUserEmail(email);
        return utilisateur.orElseThrow(() -> 
                                            new UserNotFoundException("L'utilisateur avec l'email " + email + " est introuvable"));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UtilisateurEntity> getAllUser(int page, int size, String sortBy, String sortDir) {

        var sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
                                                : Sort.by(sortBy).descending();

        var pageable = PageRequest.of(page, size, sort);

        return userRepository.findAll(pageable);
    }

    @Override
    @Transactional
    public void updatePassword(UtilisateurUpdatePasswordDto userPasswordDto, String token) {

        String email = "";

        UtilisateurEntity user = userRepository.findByUserEmail(email)
                .orElseThrow(() -> new UserNotFoundException("L'utilisateur avec l'email " + email + " est introuvable"));

        user.setUserPassword(passwordEncoder.encode(userPasswordDto.validatePassword()));
        
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void updatePassword(String email, String newPassword) {
        UtilisateurEntity user = userRepository.findByUserEmail(email)
                .orElseThrow(() -> new UserNotFoundException("L'utilisateur avec l'email " + email + " est introuvable"));

        user.setUserPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Transactional
    public void toggleFavori(UUID userPublicId, UUID etablissementPublicId) {
        // 1. Récupérer l'utilisateur
        UtilisateurEntity user = userRepository.findByPublicId(userPublicId)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur introuvable"));

        // 2. Vérifier et Basculer (Toggle) - on travaille avec les UUIDs
        boolean wasAdded;
        if (user.getFavorisIds().contains(etablissementPublicId)) {
            // CAS 1 : On retire le favori
            user.getFavorisIds().remove(etablissementPublicId);
            wasAdded = false;
        } else {
            // CAS 2 : On ajoute le favori
            user.getFavorisIds().add(etablissementPublicId);
            wasAdded = true;
        }
        
        // 3. Sauvegarder l'utilisateur
        userRepository.save(user);
        
        // 4. Publier un événement pour que le module Etablissement mette à jour son compteur
        eventPublisher.publishEvent(new FavoriToggledEvent(etablissementPublicId, wasAdded));
    }


    @Override
    @Transactional(readOnly = true)
    public UtilisateurEntity findByPublicId(UUID id) {
        return userRepository.findByPublicId(id)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé avec l'id : " + id));
    }

    // ==================== MÉTHODES ADMIN ====================

    @Override
    @Transactional(readOnly = true)
    public long countAll() {
        return userRepository.count();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdminUserDto> searchUsersForAdmin(int page, int size, String sort, String sortDir, String search) {
        Sort sortOrder = sortDir.equalsIgnoreCase("asc") 
            ? Sort.by(sort).ascending() 
            : Sort.by(sort).descending();
        
        PageRequest pageable = PageRequest.of(page, size, sortOrder);
        
        Page<UtilisateurEntity> users;
        if (search != null && !search.isBlank()) {
            users = userRepository.searchUsers(search, pageable);
        } else {
            users = userRepository.findAll(pageable);
        }
        
        return users.map(this::toAdminUserDto);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminUserDto getUserByPublicIdForAdmin(UUID publicId) {
        UtilisateurEntity user = userRepository.findByPublicId(publicId)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé avec l'ID: " + publicId));
        return toAdminUserDto(user);
    }

    @Override
    @Transactional
    public AdminUserDto updateUserForAdmin(UUID publicId, AdminUpdateUserRequest request) {
        UtilisateurEntity user = userRepository.findByPublicId(publicId)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé avec l'ID: " + publicId));
        
        if (request.nomComplet() != null) {
            user.setNomComplet(request.nomComplet());
        }
        if (request.email() != null) {
            user.setUserEmail(request.email());
        }
        if (request.paysOrigine() != null) {
            user.setPaysOrigine(request.paysOrigine());
        }
        if (request.role() != null) {
            user.setRole(request.role());
        }
        
        UtilisateurEntity saved = userRepository.save(user);
        return toAdminUserDto(saved);
    }

    @Override
    @Transactional
    public AdminUserDto updateUserRole(UUID publicId, Role role) {
        UtilisateurEntity user = userRepository.findByPublicId(publicId)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé avec l'ID: " + publicId));
        user.setRole(role);
        UtilisateurEntity saved = userRepository.save(user);
        return toAdminUserDto(saved);
    }

    @Override
    @Transactional
    public boolean toggleUserLock(UUID publicId) {
        UtilisateurEntity user = userRepository.findByPublicId(publicId)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé avec l'ID: " + publicId));
        boolean newLockState = !user.isAccountLocked();
        user.setAccountLocked(newLockState);
        userRepository.save(user);
        return newLockState;
    }

    @Override
    @Transactional
    public void deleteUserByPublicId(UUID publicId) {
        UtilisateurEntity user = userRepository.findByPublicId(publicId)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé avec l'ID: " + publicId));
        userRepository.delete(user);
    }

    @Override
    @Transactional
    public int deleteUsersBatch(List<UUID> userIds) {
        int deleted = 0;
        for (UUID id : userIds) {
            try {
                deleteUserByPublicId(id);
                deleted++;
            } catch (Exception e) {
                // Log et continuer
            }
        }
        return deleted;
    }

    /**
     * Convertit une entité UtilisateurEntity en AdminUserDto
     */
    private AdminUserDto toAdminUserDto(UtilisateurEntity user) {
        return AdminUserDto.builder()
                .publicId(user.getPublicId())
                .nomComplet(user.getNomComplet())
                .email(user.getUserEmail())
                .paysOrigine(user.getPaysOrigine())
                .photoProfile(user.getPhotoProfile())
                .favorisIds(user.getFavorisIds())
                .role(user.getRole())
                .accountLocked(user.isAccountLocked())
                .emailVerified(false) // Champ non implémenté actuellement
                .dateCreation(user.getDateCreation())
                .build();
    }
}

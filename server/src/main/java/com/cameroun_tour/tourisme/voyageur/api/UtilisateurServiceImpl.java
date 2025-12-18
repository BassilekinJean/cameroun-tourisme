package com.cameroun_tour.tourisme.voyageur.api;

import static java.util.Objects.requireNonNull;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Optional;
import java.util.UUID;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

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
    
    private static final String UPLOAD_DIR = "uploads/profiles";


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
                                  u.getFavorisIds()); // Directement les UUIDs
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

    @Override
    @Transactional
    public String updateProfilePhoto(String email, MultipartFile file) throws Exception {
        UtilisateurEntity user = userRepository.findByUserEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé"));

        // Créer le répertoire d'upload s'il n'existe pas
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Générer un nom de fichier unique
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".") 
            ? originalFilename.substring(originalFilename.lastIndexOf(".")) 
            : ".jpg";
        String filename = user.getPublicId() + "_" + System.currentTimeMillis() + extension;

        // Sauvegarder le fichier
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Mettre à jour l'utilisateur avec l'URL de la photo
        String photoUrl = "/api/media/profiles/" + filename;
        user.setPhotoProfile(photoUrl);
        userRepository.save(user);

        return photoUrl;
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

}

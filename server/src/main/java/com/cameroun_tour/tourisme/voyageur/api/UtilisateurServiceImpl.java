package com.cameroun_tour.tourisme.voyageur.api;

import static java.util.Objects.requireNonNull;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cameroun_tour.tourisme.voyageur.UtilisateurService;
import com.cameroun_tour.tourisme.etablissement.Etablissement;
import com.cameroun_tour.tourisme.etablissement.EtablissementServiceApi;
import com.cameroun_tour.tourisme.voyageur.UtilisateurEntity;
import com.cameroun_tour.tourisme.voyageur.errors.UserNotFoundException;
import com.cameroun_tour.tourisme.voyageur.model.UtilisateurUpdatePasswordDto;
import com.cameroun_tour.tourisme.voyageur.model.UtilisateurDto;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Tag(name = "User Service", description = "Logique Métier de gestion des comptes utilisateurs")
public class UtilisateurServiceImpl implements UtilisateurService {

    private final UtilisateurRepository userRepository;
    private final EtablissementServiceApi etablissementService;


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
        Optional<UtilisateurEntity> user = userRepository.findByPublicId(id);
        if (user.isEmpty()) {
            throw new UserNotFoundException("Aucun utilisateur trouvé");
        }


        UtilisateurEntity u = user.get();

        Set<UUID> favorisIds = u.getFavoris().stream()
                .map(Etablissement::getPublicId)
                .collect(Collectors.toSet());

        return new UtilisateurDto(u.getPublicId(), 
                                  u.getNomComplet(),
                                  u.getUserEmail(),
                                  u.getPaysOrigine(),
                                  u.getPhotoProfile(),
                                  favorisIds);
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

        user.setUserPassword(userPasswordDto.validatePassword());
        
        userRepository.save(user);
    }

    @Transactional
    public void toggleFavori(UUID userPublicId, UUID etablissementPublicId) {
        // 1. Récupérer l'utilisateur
        UtilisateurEntity user = userRepository.findByPublicId(userPublicId)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur introuvable"));

        // 2. Récupérer l'établissement
        Etablissement lieu = etablissementService.findByPublicId(etablissementPublicId);

        if(lieu == null){
            throw new EntityNotFoundException("Lieu Inconnu");
        }
        // 3. Vérifier et Basculer (Toggle)
        if (user.getFavoris().contains(lieu)) {
            // CAS 1 : On retire le favori
            user.getFavoris().remove(lieu);
            // On décrémente le compteur (en évitant les négatifs par sécurité)
            lieu.setNombreFavoris(Math.max(0, lieu.getNombreFavoris() - 1));
        } else {
            // CAS 2 : On ajoute le favori
            user.getFavoris().add(lieu);
            // On incrémente le compteur
            lieu.setNombreFavoris(lieu.getNombreFavoris() + 1);
        }
        
        // 4. Sauvegarder (JPA gère la table de jointure user_favoris automatiquement)
        userRepository.save(user);
        etablissementService.save(lieu);
    }


    @Override
    @Transactional(readOnly = true)
    public UtilisateurEntity findByPublicId(UUID id) {
        return userRepository.findByPublicId(id)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé avec l'id : " + id));
    }

}

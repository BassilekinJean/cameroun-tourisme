package com.cameroun_tour.tourisme.voyageur;

import java.util.UUID;

import org.springframework.data.domain.Page;

import com.cameroun_tour.tourisme.voyageur.model.UtilisateurUpdatePasswordDto;
import com.cameroun_tour.tourisme.voyageur.model.UtilisateurProfileDto;


public interface UtilisateurService {

    void deleteAccountWithId(Long id);

    UtilisateurProfileDto getUserProfile(UUID id);

    void updateUserProfile(UtilisateurProfileDto userProfile, String email);

    void updatePassword(UtilisateurUpdatePasswordDto userPasswordDto, String token);

    UtilisateurEntity findByPublicId(UUID id);

    UtilisateurEntity findByEmail(String email);
    
    Page<UtilisateurEntity> getAllUser(int page, int size, String sortBy, String sortDir);
}

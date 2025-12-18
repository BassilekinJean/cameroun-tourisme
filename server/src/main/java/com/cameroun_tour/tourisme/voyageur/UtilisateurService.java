package com.cameroun_tour.tourisme.voyageur;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

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
}

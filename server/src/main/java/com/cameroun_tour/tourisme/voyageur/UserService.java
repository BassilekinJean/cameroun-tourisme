package com.cameroun_tour.tourisme.voyageur;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.MethodArgumentNotValidException;

import com.cameroun_tour.tourisme.voyageur.model.UtilisateurEntity;

public interface UserService {

    void createUserAccount(UserRegistrationDto registrationDto) throws MethodArgumentNotValidException;

    void deleteAccountWithId(Long id);

    UserProfileDto getUserProfile(Long id);

    void updateUserProfile(UserProfileDto userProfile, Long id);

    UtilisateurEntity findByEmail(String email);
    
    Page<UtilisateurEntity> getAllUser(int page, int size, String sortBy, String sortDir);
}

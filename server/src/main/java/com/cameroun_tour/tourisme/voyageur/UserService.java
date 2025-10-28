package com.cameroun_tour.tourisme.voyageur;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.MethodArgumentNotValidException;

import com.cameroun_tour.tourisme.voyageur.model.UpdateUserPasswordDto;
import com.cameroun_tour.tourisme.voyageur.model.UserProfileDto;
import com.cameroun_tour.tourisme.voyageur.model.UserRegistrationDto;

public interface UserService {

    void createUserAccount(UserRegistrationDto registrationDto) throws MethodArgumentNotValidException;

    void deleteAccountWithId(Long id);

    UserProfileDto getUserProfile(Long id);

    void updateUserProfile(UserProfileDto userProfile, String token);

    void updatePassword(UpdateUserPasswordDto userPasswordDto, String token);

    UtilisateurEntity findByEmail(String email);
    
    Page<UtilisateurEntity> getAllUser(int page, int size, String sortBy, String sortDir);
}

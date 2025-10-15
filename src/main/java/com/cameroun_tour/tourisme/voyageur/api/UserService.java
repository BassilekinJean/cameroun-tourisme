package com.cameroun_tour.tourisme.voyageur.api;

import java.util.Optional;

import com.cameroun_tour.tourisme.voyageur.Utilisateur;
import com.cameroun_tour.tourisme.voyageur.dto.UserProfileDto;
import com.cameroun_tour.tourisme.voyageur.dto.UserRegistrationDto;

public interface UserService {

    void createUserAccount(UserRegistrationDto registrationDto);

    Optional<Utilisateur> findUserWithEmail(String email);

    void deleteAccountWithEmail(String email);

    void deleteAccountWithId(Long id);

    UserProfileDto getUserProfile(String email);

    void updateUserProfile(UserProfileDto userProfile);
}

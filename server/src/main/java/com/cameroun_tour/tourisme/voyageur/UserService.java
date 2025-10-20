package com.cameroun_tour.tourisme.voyageur;


public interface UserService {

    void createUserAccount(UserRegistrationDto registrationDto);

    void deleteAccountWithId(Long id);

    UserProfileDto getUserProfile(Long id);

    void updateUserProfile(UserProfileDto userProfile, Long id);

    //Admin service
    //Page<UserProfileDto> getAllUser();
}

package com.cameroun_tour.tourisme.voyageur.service;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.cameroun_tour.tourisme.voyageur.Utilisateur;
import com.cameroun_tour.tourisme.voyageur.UtilisateurRepository;
import com.cameroun_tour.tourisme.voyageur.dto.UserProfileDto;
import com.cameroun_tour.tourisme.voyageur.dto.UserRegistrationDto;
import com.cameroun_tour.tourisme.voyageur.api.UserService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Tag(name = "User Service", description = "Logique Métier de gestion des comptes utilisateurs")
public class UtilisateurService implements UserService {

    private final UtilisateurRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void createUserAccount(UserRegistrationDto registrationDto) {
        Utilisateur newUser = new Utilisateur();

        newUser.setNomComplet(registrationDto.nomComplet());
        newUser.setPaysOrigine(registrationDto.paysOrigine());
        newUser.setUserEmail(registrationDto.email());
        newUser.setUserPassword(passwordEncoder.encode(registrationDto.password()));

        userRepository.save(newUser);
    }

    @Override
    public Optional<Utilisateur> findUserWithEmail(String email){
        return userRepository.findByUtilisateurEmail(email);
    }

    @Override
    public void deleteAccountWithEmail(String email){
        userRepository.deleteByUtilisateurEmail(email);
    }

    @Override
    public void deleteAccountWithId(Long id){
        userRepository.deleteById(id);
    }

    @Override
    public UserProfileDto getUserProfile(String email){
        Optional<Utilisateur> user = findUserWithEmail(email);
        if (user.isEmpty()) {
            throw new RuntimeException("Aucun utilisateur trouvé");
        }
        Utilisateur u = user.get();
        return new UserProfileDto(u.getNomComplet(),
                                  u.getUserEmail(),
                                  u.getPaysOrigine(),
                                  u.getUserPassword(),
                                  u.getPhotoProfile());
    }

    @Override
    public void updateUserProfile(UserProfileDto userProfile){
        Optional<Utilisateur> userOpt = userRepository.findByUtilisateurEmail(userProfile.email());

        if (userOpt.isEmpty()) {
            throw new RuntimeException("Aucun utilisateur trouvé");
        }
        Utilisateur user = userOpt.get();
        user.setNomComplet(userProfile.nomComplet());
        user.setPaysOrigine(userProfile.paysOrigine());
        user.setUserEmail(userProfile.email());
        // encode password when updating
        user.setUserPassword(passwordEncoder.encode(userProfile.password()));

        userRepository.save(user);
    }
}

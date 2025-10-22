package com.cameroun_tour.tourisme.voyageur.api;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.MethodArgumentNotValidException;

import com.cameroun_tour.tourisme.voyageur.UserProfileDto;
import com.cameroun_tour.tourisme.voyageur.UserRegistrationDto;
import com.cameroun_tour.tourisme.voyageur.UserService;
import com.cameroun_tour.tourisme.voyageur.errors.UserNotFoundException;
import com.cameroun_tour.tourisme.voyageur.model.UtilisateurEntity;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
@Tag(name = "User Service", description = "Logique Métier de gestion des comptes utilisateurs")
public class UtilisateurServiceImpl implements UserService {

    private final UtilisateurRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void createUserAccount(UserRegistrationDto registrationDto) throws MethodArgumentNotValidException {
        UtilisateurEntity newUser = new UtilisateurEntity();

        newUser.setNomComplet(registrationDto.nomComplet());
        newUser.setPaysOrigine(registrationDto.paysOrigine());
        newUser.setUserEmail(registrationDto.email());
        newUser.setUserPassword(passwordEncoder.encode(registrationDto.password()));

        userRepository.save(newUser);

    }

    @Override
    public void deleteAccountWithId(Long id) {
        UtilisateurEntity userToDelete = this.userRepository.findById(id)
                                                            .orElseThrow(() -> 
                                                                            new UserNotFoundException("Aucun utilisateur trouver"));
        userRepository.deleteById(userToDelete.getId());
    }

    @Override
    public UserProfileDto getUserProfile(Long id){
        Optional<UtilisateurEntity> user = userRepository.findById(id);
        if (user.isEmpty()) {
            throw new UserNotFoundException("Aucun utilisateur trouvé");
        }
        UtilisateurEntity u = user.get();
        return new UserProfileDto(u.getNomComplet(),
                                  u.getUserEmail(),
                                  u.getPaysOrigine(),
                                  u.getUserPassword(),
                                  u.getPhotoProfile());
    }

    @Override
    public void updateUserProfile(UserProfileDto userProfile, Long id){
        Optional<UtilisateurEntity> userOpt = userRepository.findById(id);

        if (userOpt.isEmpty()) {
            throw new UserNotFoundException("Aucun utilisateur trouvé");
        }
        UtilisateurEntity user = userOpt.get();
        user.setNomComplet(userProfile.nomComplet());
        user.setPaysOrigine(userProfile.paysOrigine());
        user.setUserEmail(userProfile.email());
        user.setUserPassword(passwordEncoder.encode(userProfile.password()));

        userRepository.save(user);
    }

    @Override
    public UtilisateurEntity findByEmail(String email){

        Optional <UtilisateurEntity> utilisateur = this.userRepository.findByUserEmail(email);
        return utilisateur.orElseThrow(() -> 
                                            new UserNotFoundException("L'utilisateur avec l'email " + email + " est introuvable"));
    }

}

package com.cameroun_tour.tourisme.voyageur.api;

import java.util.Optional;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cameroun_tour.tourisme.voyageur.UserProfileDto;
import com.cameroun_tour.tourisme.voyageur.UserRegistrationDto;
import com.cameroun_tour.tourisme.voyageur.UserService;
import com.cameroun_tour.tourisme.voyageur.errors.EmailAlreadyExistsException;
import com.cameroun_tour.tourisme.voyageur.errors.UserNotFoundException;
import com.cameroun_tour.tourisme.voyageur.model.UtilisateurEntity;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Tag(name = "User Service", description = "Logique Métier de gestion des comptes utilisateurs")
public class UtilisateurServiceImpl implements UserService {

    private final UtilisateurRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void createUserAccount(UserRegistrationDto registrationDto){
        
        try {
            UtilisateurEntity newUser = new UtilisateurEntity();

            newUser.setNomComplet(registrationDto.nomComplet());
            newUser.setPaysOrigine(registrationDto.paysOrigine());
            newUser.setUserEmail(registrationDto.email());
            newUser.setUserPassword(passwordEncoder.encode(registrationDto.password()));

            userRepository.saveAndFlush(newUser);
        } catch (DataIntegrityViolationException e) {
            throw new EmailAlreadyExistsException("Un utilisateur avec cet email existe déjà.");
        }
        

    }

    @Override
    @Transactional
    public void deleteAccountWithId(Long id) {
        UtilisateurEntity userToDelete = this.userRepository.findById(id)
                                                    .orElseThrow(() -> 
                                                    new UserNotFoundException("Aucun utilisateur trouver"));

        userRepository.deleteById(userToDelete.getId());
    }

    @Override
    @Transactional(readOnly = true)
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
    @Transactional
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

}

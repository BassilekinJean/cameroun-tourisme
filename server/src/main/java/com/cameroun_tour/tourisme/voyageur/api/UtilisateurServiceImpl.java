package com.cameroun_tour.tourisme.voyageur.api;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cameroun_tour.tourisme.voyageur.UserService;
import com.cameroun_tour.tourisme.voyageur.UtilisateurEntity;
import com.cameroun_tour.tourisme.voyageur.errors.UserNotFoundException;
import com.cameroun_tour.tourisme.voyageur.model.UpdateUserPasswordDto;
import com.cameroun_tour.tourisme.voyageur.model.UserProfileDto;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Tag(name = "User Service", description = "Logique Métier de gestion des comptes utilisateurs")
public class UtilisateurServiceImpl implements UserService {

    private final UtilisateurRepository userRepository;


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
                                  u.getPhotoProfile());
    }

    @Override
    @Transactional
    public void updateUserProfile(UserProfileDto userProfile, String token){

        Long id =1L;
        Optional<UtilisateurEntity> userOpt = userRepository.findById(id);

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
    public void updatePassword(UpdateUserPasswordDto userPasswordDto, String token) {

        String email = "";

        Optional<UtilisateurEntity> user = userRepository.findByUserEmail(email);

        if (user == null) {
            throw new UserNotFoundException("L'utilisateur avec l'email " + email + " est introuvable");
        }
        user.get().setUserPassword(userPasswordDto.validatePassword());
        
        userRepository.save(user.get());
    }

}

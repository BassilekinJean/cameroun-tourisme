package com.cameroun_tour.tourisme.voyageur.api;

import java.util.Map;
import java.util.UUID;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cameroun_tour.tourisme.common.email.EmailServiceApi;
import com.cameroun_tour.tourisme.voyageur.UtilisateurService;
import com.cameroun_tour.tourisme.voyageur.UtilisateurEntity;
import com.cameroun_tour.tourisme.voyageur.model.UtilisateurDto;
import com.cameroun_tour.tourisme.voyageur.model.UtilisateurUpdatePasswordDto;
import com.cameroun_tour.tourisme.voyageur.model.VoyageurResponse;

import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;



@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
@Tag(name = "Utilisateur", description = "Gestion du profil utilisateur")
public class UtilisateurController {

    private final UtilisateurService userService;
    private final VoyageurAssembler voyageurAssembler;
    private final EmailServiceApi emailService;

    @GetMapping(path = "/me", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<VoyageurResponse> getMyProfile(Authentication authentication) {
        String userEmail = authentication.getName(); 
        UtilisateurEntity user = this.userService.findByEmail(userEmail); 
        
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(voyageurAssembler.toModel(user));
    }

    @PatchMapping("/addFavoris/{etablissementId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> toggleFavori(
            @AuthenticationPrincipal UtilisateurEntity currentUser,
            @PathVariable UUID etablissementId) {
        
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        userService.toggleFavori(currentUser.getPublicId(), etablissementId);
        return ResponseEntity.ok().build();
    }

    @GetMapping(path = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<VoyageurResponse> getProfileWithId(@PathVariable UUID id) {
        UtilisateurEntity searchedUser = this.userService.findByPublicId(id);
        if (searchedUser == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.status(HttpStatus.FOUND).body(voyageurAssembler.toModel(searchedUser));
    }  
    
    @SuppressWarnings("null")
    @GetMapping(path = "/all", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PagedModel<VoyageurResponse>> listerTousLesUsers(@RequestParam int page, 
                                                                    @RequestParam int size, 
                                                                    @RequestParam String sort, 
                                                                    @RequestParam String sortDir,
                                                                    PagedResourcesAssembler<UtilisateurEntity> pagedAssembler) {

        Page<UtilisateurEntity> users = userService.getAllUser(page, size, sort, sortDir);
        if (users == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(pagedAssembler.toModel(users, voyageurAssembler));
    }

    @PutMapping("/update")
    @Operation(summary = "Mettre à jour le profil", description = "Met à jour les informations du profil utilisateur")
    public ResponseEntity<VoyageurResponse> updateProfilInfo(@Valid @RequestBody UtilisateurDto entity, Authentication authentication) {
        
        String email = authentication.getName();
        userService.updateUserProfile(entity, email);
        
        UtilisateurEntity updatedUser = userService.findByEmail(entity.email());
        
        if (updatedUser == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(voyageurAssembler.toModel(updatedUser));
    }

    @PostMapping("/send-password-change-otp")
    @RateLimiter(name = "otpRateLimiter")
    @Operation(summary = "Envoyer OTP pour changement de mot de passe", 
               description = "Envoie un code OTP à l'email de l'utilisateur pour valider le changement de mot de passe")
    public ResponseEntity<Map<String, String>> sendPasswordChangeOtp(Authentication authentication) {
        String email = authentication.getName();
        emailService.sendOtp(email);
        return ResponseEntity.ok(Map.of(
            "message", "Un code de vérification a été envoyé à votre adresse email",
            "email", email
        ));
    }

    @PostMapping("/change-password")
    @RateLimiter(name = "otpRateLimiter")
    @Operation(summary = "Changer le mot de passe avec OTP", 
               description = "Change le mot de passe après vérification du code OTP")
    public ResponseEntity<Map<String, String>> changePassword(
            @Valid @RequestBody UtilisateurUpdatePasswordDto passwordDto,
            @RequestParam String otp,
            Authentication authentication) {
        
        String email = authentication.getName();
        
        // Vérifier l'OTP
        if (!emailService.verifyOtp(email, otp)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Code OTP invalide ou expiré"));
        }
        
        // Vérifier que les mots de passe correspondent
        if (!passwordDto.newPassword().equals(passwordDto.validatePassword())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Les mots de passe ne correspondent pas"));
        }
        
        // Mettre à jour le mot de passe
        userService.updatePassword(email, passwordDto.newPassword());
        
        return ResponseEntity.ok(Map.of("message", "Mot de passe mis à jour avec succès"));
    }

}
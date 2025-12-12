package com.cameroun_tour.tourisme.etablissement.api;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cameroun_tour.tourisme.common.contracts.AvisCreationDto;
import com.cameroun_tour.tourisme.etablissement.Etablissement;
import com.cameroun_tour.tourisme.etablissement.EtablissementServiceApi;
import com.cameroun_tour.tourisme.voyageur.UtilisateurEntity;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/lieux")
@RequiredArgsConstructor
public class EtablissementController {

    private final EtablissementServiceApi etablissementService;

    @GetMapping
    public ResponseEntity<List<Etablissement>> listerTous() {
        return ResponseEntity.ok(etablissementService.listerTousLesEtablissements());
    }

    @PostMapping("/register")
    public ResponseEntity<Void> registerLieu(@RequestBody @Valid LieuRegistrationDto dto) {
        etablissementService.registerLieu(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/{publicId}/post-avis")
    public ResponseEntity<Void> creerAvis(
            @PathVariable Long publicId,
            @RequestBody @Valid AvisCreationDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UtilisateurEntity currentUser = (UtilisateurEntity) authentication.getPrincipal();

        etablissementService.publierAvis(publicId, userDetails.getUsername(), dto);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    
}
package com.cameroun_tour.tourisme.etablissement.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cameroun_tour.tourisme.common.contracts.CommentaireCreationDto;
import com.cameroun_tour.tourisme.etablissement.EtablissementServiceApi;
import com.cameroun_tour.tourisme.voyageur.UtilisateurEntity;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/etablissements")
@RequiredArgsConstructor
public class EtablissementController {

    private final EtablissementServiceApi etablissementService;

    @PostMapping("/{etablissementId}/commentaires")
    public ResponseEntity<Void> creerCommentaire(
            @PathVariable Long etablissementId,
            @RequestBody @Valid CommentaireCreationDto dto) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UtilisateurEntity currentUser = (UtilisateurEntity) authentication.getPrincipal();

        etablissementService.publierCommentaire(etablissementId, currentUser.getUsername(), dto);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }
}
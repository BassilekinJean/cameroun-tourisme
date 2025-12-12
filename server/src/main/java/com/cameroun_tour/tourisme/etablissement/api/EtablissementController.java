package com.cameroun_tour.tourisme.etablissement.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cameroun_tour.tourisme.common.contracts.AvisCreationDto;
import com.cameroun_tour.tourisme.etablissement.EtablissementServiceApi;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/lieux")
@RequiredArgsConstructor
public class EtablissementController {

    private final EtablissementServiceApi etablissementService;

    @PostMapping("/{publicId}/post-avis")
    public ResponseEntity<Void> creerAvis(
            @PathVariable Long publicId,
            @RequestBody @Valid AvisCreationDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        

        etablissementService.publierAvis(publicId, userDetails.getUsername(), dto);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    
}
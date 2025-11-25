package com.cameroun_tour.tourisme.Avis.api;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cameroun_tour.tourisme.Avis.Avis;
import com.cameroun_tour.tourisme.Avis.AvisServiceApi;
import com.cameroun_tour.tourisme.Avis.model.AvisDto;
import com.cameroun_tour.tourisme.voyageur.UtilisateurEntity;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.MediaType;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/api/avis")
@RequiredArgsConstructor
public class AvisController {

    private final AvisServiceApi avisService;
    private final AvisModelAssembler avisAssembler;

    @GetMapping("/{publicId}")
    public ResponseEntity<AvisDto> getOneAvis(@RequestParam UUID publicUuid) {
        var avis = avisService.getOneAvis(publicUuid);

        if (avis == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(avisAssembler.toModel(avis));
    }
    
    
    @GetMapping(path = "/all", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Page<Avis>> listerLesAvisDunLieu(@RequestParam Long lieuId,
                                                                            @RequestParam int page, 
                                                                            @RequestParam int size, 
                                                                            @RequestParam String sort, 
                                                                            @RequestParam String sortDir)
    {
        return ResponseEntity.ok().body(avisService.listerLesAvisLieu(lieuId, page, size, sort, sortDir));
    }

    @GetMapping(path = "/user", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Page<AvisDto>> listerUserAvis(@RequestParam UUID userId,
                                                         @RequestParam int page, 
                                                         @RequestParam int size, 
                                                         @RequestParam String sort, 
                                                         @RequestParam String sortDir)
    {
        return ResponseEntity.ok().body(avisService.utilisateurAvis(userId, page, size, sort, sortDir));
    }

    @PutMapping("/update")
    public ResponseEntity<Void> modifierUnAvis(@Valid @RequestBody AvisDto entity) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UtilisateurEntity currentUser = (UtilisateurEntity) authentication.getPrincipal();

        avisService.editAvis(currentUser.getPublicId(), entity);
        return ResponseEntity.accepted().build();
    }


    @DeleteMapping("/{avisId}/del")
    public ResponseEntity<Void> supprimerMonAvis(@PathVariable UUID avisId){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UtilisateurEntity currentUser = (UtilisateurEntity) authentication.getPrincipal();

        avisService.supprimerUserAvis(currentUser.getPublicId(), avisId);
        return ResponseEntity.noContent().build();
    }
    
    
}

package com.cameroun_tour.tourisme.voyageur.api;

import java.util.UUID;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cameroun_tour.tourisme.voyageur.UtilisateurService;
import com.cameroun_tour.tourisme.voyageur.UtilisateurEntity;
import com.cameroun_tour.tourisme.voyageur.model.UtilisateurDto;
import com.cameroun_tour.tourisme.voyageur.model.VoyageurResponse;

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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;



@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UtilisateurController {

    private final UtilisateurService userService;
    private final VoyageurAssembler voyageurAssembler;

    @GetMapping(path = "/me", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<VoyageurResponse> getMyProfile(Authentication authentication) {
        String userEmail = authentication.getName(); 
        UtilisateurEntity user = this.userService.findByEmail(userEmail); 
        
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(voyageurAssembler.toModel(user));
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
    public ResponseEntity<VoyageurResponse> updateProfilInfo(@Valid @RequestBody UtilisateurDto entity, Authentication authentication) {
        
        String email = authentication.getName();
        userService.updateUserProfile(entity, email);
        
        UtilisateurEntity updatedUser = userService.findByEmail(entity.email());
        
        if (updatedUser == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(voyageurAssembler.toModel(updatedUser));
    }
}
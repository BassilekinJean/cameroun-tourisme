package com.cameroun_tour.tourisme.voyageur.api;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cameroun_tour.tourisme.voyageur.UserService;
import com.cameroun_tour.tourisme.voyageur.UtilisateurEntity;
import com.cameroun_tour.tourisme.voyageur.model.UserProfileDto;
import com.cameroun_tour.tourisme.voyageur.model.UserRegistrationDto;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;




@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UtilisateurController {

    private final UserService userService;

    @PostMapping(path = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserRegistrationDto> createAnAccount(@Valid @RequestBody UserRegistrationDto registerUser) 
        throws MethodArgumentNotValidException, DataIntegrityViolationException
    {
        this.userService.createUserAccount(registerUser);
        return  ResponseEntity.status(HttpStatus.CREATED).body(registerUser);
    }

    @GetMapping(path = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<UserProfileDto> getProfileWithId(@PathVariable Long id) {
        UserProfileDto searchedUser = this.userService.getUserProfile(id);
        return ResponseEntity.status(HttpStatus.FOUND).body(searchedUser);
    }  
    
    @GetMapping(path = "/all", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Page<UtilisateurEntity>> listerTousLesUsers(@RequestParam int page, 
                                                                    @RequestParam int size, 
                                                                    @RequestParam String sort, 
                                                                    @RequestParam String sortDir) {

        return ResponseEntity.ok(userService.getAllUser(page, size, sort, sortDir)) ;
    }

    @PutMapping("/update")
    public ResponseEntity<UserProfileDto> updateProfilInfo(@RequestBody UserProfileDto entity, HttpServletRequest request) {
        
        String authHeader = request.getHeader("Authorization");

        userService.updateUserProfile(entity, authHeader);
        return null;
    }
    
}

package com.cameroun_tour.tourisme.voyageur.api;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cameroun_tour.tourisme.voyageur.UserProfileDto;
import com.cameroun_tour.tourisme.voyageur.UserRegistrationDto;
import com.cameroun_tour.tourisme.voyageur.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UtilisateurController {

    private final UserService userService;

    @PostMapping(path = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserRegistrationDto> createAnAccount(@Valid@RequestBody UserRegistrationDto registerUser) 
        throws MethodArgumentNotValidException 
    {
        this.userService.createUserAccount(registerUser);
        return  ResponseEntity.status(HttpStatus.CREATED).body(registerUser);
    }

    @GetMapping(path = "/api/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserProfileDto> getProfileWithId(@RequestParam Long id) {
        UserProfileDto searchedUser = this.userService.getUserProfile(id);
        return ResponseEntity.status(HttpStatus.FOUND).body(searchedUser);
    }  
    
}

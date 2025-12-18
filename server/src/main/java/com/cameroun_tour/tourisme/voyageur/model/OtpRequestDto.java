package com.cameroun_tour.tourisme.voyageur.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * DTO pour la demande d'envoi d'un code OTP
 */
public record OtpRequestDto(
    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "L'email doit être valide")
    String email
) {}

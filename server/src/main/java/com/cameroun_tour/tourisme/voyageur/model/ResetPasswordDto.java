package com.cameroun_tour.tourisme.voyageur.model;

import com.cameroun_tour.tourisme.common.utils.validators.ValidPassword;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO pour la réinitialisation du mot de passe avec code OTP
 */
public record ResetPasswordDto(
    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "L'email doit être valide")
    String email,
    
    @NotBlank(message = "Le code OTP est obligatoire")
    @Size(min = 6, max = 6, message = "Le code OTP doit contenir exactement 6 chiffres")
    String otp,
    
    @NotBlank(message = "Le nouveau mot de passe est obligatoire")
    @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères")
    @ValidPassword
    String newPassword,
    
    @NotBlank(message = "Veuillez confirmer le mot de passe")
    @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères")
    String confirmPassword
) {}

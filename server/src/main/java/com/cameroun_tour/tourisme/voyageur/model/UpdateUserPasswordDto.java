package com.cameroun_tour.tourisme.voyageur.model;


import com.cameroun_tour.tourisme.common.utils.validators.ValidPassword;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateUserPasswordDto(


    @NotBlank(message = "Le mot de passe est obligatoire !!!")
    @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères")
    @ValidPassword
    String newPassword,

    @NotBlank(message = "Veuillez valide le mot de passe !!!!")
    @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères")
    @ValidPassword
    String validatePassword
) {

}

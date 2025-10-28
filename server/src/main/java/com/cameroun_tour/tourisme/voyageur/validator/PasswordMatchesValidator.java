package com.cameroun_tour.tourisme.voyageur.validator;

import com.cameroun_tour.tourisme.voyageur.model.UserRegistrationDto;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordMatchesValidator implements ConstraintValidator<PasswordMatches, Object> {

    @Override
    public void initialize(PasswordMatches constraintAnnotation) {
        // Pas d'initialisation nécessaire
    }

    @Override
    public boolean isValid(Object obj, ConstraintValidatorContext context) {
        // On caste l'objet à valider en notre DTO
        UserRegistrationDto userDto = (UserRegistrationDto) obj;
        // On utilise .equals() pour comparer le contenu des chaînes
        return userDto.password().equals(userDto.validatePassword());
    }
}
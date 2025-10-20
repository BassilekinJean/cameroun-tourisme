package com.cameroun_tour.tourisme.common.utils.validators;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordValidator implements ConstraintValidator<ValidPassword, String>{

    private int minSize;

    @Override
    public void initialize(ValidPassword constraintAnnotation){
        this.minSize = constraintAnnotation.min();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        
       if (value.length() < minSize || value.isBlank()){
            return false;
       }
       return false;
    }

}

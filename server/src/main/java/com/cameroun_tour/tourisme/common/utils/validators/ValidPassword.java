package com.cameroun_tour.tourisme.common.utils.validators;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Documented
@Constraint(validatedBy = PasswordValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidPassword {

    String message() default "Le mot de passe doit contenir au moins 1 lettre majuscule, 1 lettre minuscule et 1 caractère spécial";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    int min() default 8;
}

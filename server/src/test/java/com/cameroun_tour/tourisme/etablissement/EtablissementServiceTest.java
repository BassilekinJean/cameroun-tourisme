package com.cameroun_tour.tourisme.etablissement;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.cameroun_tour.tourisme.common.utils.enums.TypeLieu;
import com.cameroun_tour.tourisme.etablissement.api.EtablissementRepository;
import com.cameroun_tour.tourisme.etablissement.api.EtablissementServiceImpl;
import com.cameroun_tour.tourisme.etablissement.model.LieuRegistrationDto;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("null")
public class EtablissementServiceTest {

    @Mock
    private EtablissementRepository etablissementRepository;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private EtablissementServiceImpl etablissementService;

    private LieuRegistrationDto registrationDto;

    @BeforeEach
    void setUp() {
        registrationDto = new LieuRegistrationDto(
            "Hotel Hilton",
            "Un hotel de luxe",
            "hilton@cameroun.cm",
            "password123",
            "password123",
            "699999999",
            "profile.jpg",
            "Centre ville",
            "Yaoundé",
            List.of("image1.jpg", "image2.jpg"),
            TypeLieu.HOTEL,
            3.848,
            11.502
        );
    }

    @Test
    void registerLieu_Success() {
        // Arrange
        when(etablissementRepository.existsByEmail(registrationDto.email())).thenReturn(false);
        when(passwordEncoder.encode(registrationDto.password())).thenReturn("encodedPassword");

        // Act
        etablissementService.registerLieu(registrationDto);

        // Assert
        verify(etablissementRepository, times(1)).save(any(Etablissement.class));
        verify(passwordEncoder, times(1)).encode(registrationDto.password());
    }

    @Test
    void registerLieu_PasswordsDoNotMatch_ThrowsException() {
        // Arrange
        LieuRegistrationDto badPasswordDto = new LieuRegistrationDto(
            "Hotel Hilton",
            "Un hotel de luxe",
            "hilton@cameroun.cm",
            "password123",
            "wrongPassword",
            "699999999",
            "profile.jpg",
            "Centre ville",
            "Yaoundé",
            List.of("image1.jpg"),
            TypeLieu.HOTEL,
            3.848,
            11.502
        );

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            etablissementService.registerLieu(badPasswordDto);
        });

        assertEquals("Les mots de passe ne correspondent pas", exception.getMessage());
        verify(etablissementRepository, times(0)).save(any(Etablissement.class));
    }

    @Test
    void registerLieu_EmailAlreadyExists_ThrowsException() {
        // Arrange
        when(etablissementRepository.existsByEmail(registrationDto.email())).thenReturn(true);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            etablissementService.registerLieu(registrationDto);
        });

        assertEquals("Cet email est déjà utilisé", exception.getMessage());
        verify(etablissementRepository, times(0)).save(any(Etablissement.class));
    }
}

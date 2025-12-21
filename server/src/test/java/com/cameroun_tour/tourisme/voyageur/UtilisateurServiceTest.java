package com.cameroun_tour.tourisme.voyageur;

import java.util.HashSet;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.cameroun_tour.tourisme.common.utils.enums.Role;
import com.cameroun_tour.tourisme.voyageur.api.UtilisateurRepository;
import com.cameroun_tour.tourisme.voyageur.api.UtilisateurServiceImpl;
import com.cameroun_tour.tourisme.voyageur.errors.UserNotFoundException;
import com.cameroun_tour.tourisme.voyageur.events.FavoriToggledEvent;
import com.cameroun_tour.tourisme.voyageur.model.UtilisateurDto;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("null")
public class UtilisateurServiceTest {

    @Mock
    private UtilisateurRepository userRepository;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UtilisateurServiceImpl utilisateurService;

    private UtilisateurEntity testUser;
    private UUID userPublicId;
    private UUID etablissementPublicId;

    @BeforeEach
    void setUp() {
        userPublicId = UUID.randomUUID();
        etablissementPublicId = UUID.randomUUID();

        testUser = UtilisateurEntity.builder()
                .id(1L)
                .publicId(userPublicId)
                .nomComplet("Jean Test")
                .userEmail("jean@test.cm")
                .userPassword("encodedPassword")
                .paysOrigine("Cameroun")
                .role(Role.USER)
                .favorisIds(new HashSet<>())
                .build();
    }

    // ==================== TESTS TOGGLE FAVORI ====================

    @Test
    void toggleFavori_AddFavori_Success() {
        // Arrange
        when(userRepository.findByPublicId(userPublicId)).thenReturn(Optional.of(testUser));

        // Act
        utilisateurService.toggleFavori(userPublicId, etablissementPublicId);

        // Assert
        assertTrue(testUser.getFavorisIds().contains(etablissementPublicId));
        verify(userRepository, times(1)).save(testUser);
        verify(eventPublisher, times(1)).publishEvent(any(FavoriToggledEvent.class));
    }

    @Test
    void toggleFavori_RemoveFavori_Success() {
        // Arrange
        testUser.getFavorisIds().add(etablissementPublicId);
        when(userRepository.findByPublicId(userPublicId)).thenReturn(Optional.of(testUser));

        // Act
        utilisateurService.toggleFavori(userPublicId, etablissementPublicId);

        // Assert
        assertFalse(testUser.getFavorisIds().contains(etablissementPublicId));
        verify(userRepository, times(1)).save(testUser);
        verify(eventPublisher, times(1)).publishEvent(any(FavoriToggledEvent.class));
    }

    @Test
    void toggleFavori_UserNotFound_ThrowsException() {
        // Arrange
        when(userRepository.findByPublicId(any())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UserNotFoundException.class, () -> {
            utilisateurService.toggleFavori(UUID.randomUUID(), etablissementPublicId);
        });

        verify(userRepository, never()).save(any());
    }

    // ==================== TESTS UPDATE USER PROFILE ====================

    @Test
    void updateUserProfile_Success() {
        // Arrange
        UtilisateurDto updateDto = new UtilisateurDto(
            userPublicId,
            "Jean Modifié",
            "jean@test.cm",
            "France",
            null,
            new HashSet<>(),
            Role.USER
        );

        when(userRepository.findByUserEmail("jean@test.cm")).thenReturn(Optional.of(testUser));

        // Act
        utilisateurService.updateUserProfile(updateDto, "jean@test.cm");

        // Assert
        assertEquals("Jean Modifié", testUser.getNomComplet());
        assertEquals("France", testUser.getPaysOrigine());
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void updateUserProfile_UserNotFound_ThrowsException() {
        // Arrange
        UtilisateurDto updateDto = new UtilisateurDto(
            userPublicId, "Jean", "unknown@test.cm", "Cameroun", null, new HashSet<>(), Role.USER
        );

        when(userRepository.findByUserEmail("unknown@test.cm")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UserNotFoundException.class, () -> {
            utilisateurService.updateUserProfile(updateDto, "unknown@test.cm");
        });
    }

    // ==================== TESTS UPDATE PASSWORD ====================

    @Test
    void updatePassword_Success() {
        // Arrange
        when(userRepository.findByUserEmail("jean@test.cm")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.encode("newPassword123")).thenReturn("encodedNewPassword");

        // Act
        utilisateurService.updatePassword("jean@test.cm", "newPassword123");

        // Assert
        assertEquals("encodedNewPassword", testUser.getUserPassword());
        verify(userRepository, times(1)).save(testUser);
        verify(passwordEncoder, times(1)).encode("newPassword123");
    }

    @Test
    void updatePassword_UserNotFound_ThrowsException() {
        // Arrange
        when(userRepository.findByUserEmail("unknown@test.cm")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UserNotFoundException.class, () -> {
            utilisateurService.updatePassword("unknown@test.cm", "newPassword");
        });
    }

    // ==================== TESTS FIND BY EMAIL ====================

    @Test
    void findByEmail_Success() {
        // Arrange
        when(userRepository.findByUserEmail("jean@test.cm")).thenReturn(Optional.of(testUser));

        // Act
        UtilisateurEntity result = utilisateurService.findByEmail("jean@test.cm");

        // Assert
        assertNotNull(result);
        assertEquals("jean@test.cm", result.getUserEmail());
    }

    @Test
    void findByEmail_NotFound_ThrowsException() {
        // Arrange
        when(userRepository.findByUserEmail("unknown@test.cm")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UserNotFoundException.class, () -> {
            utilisateurService.findByEmail("unknown@test.cm");
        });
    }

    // ==================== TESTS GET USER PROFILE ====================

    @Test
    void getUserProfile_Success() {
        // Arrange
        when(userRepository.findByPublicId(userPublicId)).thenReturn(Optional.of(testUser));

        // Act
        UtilisateurDto result = utilisateurService.getUserProfile(userPublicId);

        // Assert
        assertNotNull(result);
        assertEquals("Jean Test", result.nomComplet());
        assertEquals("jean@test.cm", result.email());
    }

    @Test
    void getUserProfile_NotFound_ThrowsException() {
        // Arrange
        when(userRepository.findByPublicId(any())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UserNotFoundException.class, () -> {
            utilisateurService.getUserProfile(UUID.randomUUID());
        });
    }

    // ==================== TESTS ADMIN OPERATIONS ====================

    @Test
    void toggleUserLock_Success() {
        // Arrange
        testUser.setAccountLocked(false);
        when(userRepository.findByPublicId(userPublicId)).thenReturn(Optional.of(testUser));

        // Act
        boolean newLockState = utilisateurService.toggleUserLock(userPublicId);

        // Assert
        assertTrue(newLockState);
        assertTrue(testUser.isAccountLocked());
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void deleteUserByPublicId_Success() {
        // Arrange
        when(userRepository.findByPublicId(userPublicId)).thenReturn(Optional.of(testUser));

        // Act
        utilisateurService.deleteUserByPublicId(userPublicId);

        // Assert
        verify(userRepository, times(1)).delete(testUser);
    }

    @Test
    void deleteUserByPublicId_NotFound_ThrowsException() {
        // Arrange
        when(userRepository.findByPublicId(any())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UserNotFoundException.class, () -> {
            utilisateurService.deleteUserByPublicId(UUID.randomUUID());
        });
    }
}

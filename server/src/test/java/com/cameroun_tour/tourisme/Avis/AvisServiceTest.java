package com.cameroun_tour.tourisme.Avis;

import java.time.LocalDate;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import com.cameroun_tour.tourisme.Avis.api.AvisRepository;
import com.cameroun_tour.tourisme.Avis.api.AviserviceImpl;
import com.cameroun_tour.tourisme.Avis.errors.CommentNotFoundException;
import com.cameroun_tour.tourisme.Avis.model.AvisUpdateDto;
import com.cameroun_tour.tourisme.common.AvisEtablissementService;
import com.cameroun_tour.tourisme.etablissement.Etablissement;
import com.cameroun_tour.tourisme.voyageur.UtilisateurEntity;
import com.cameroun_tour.tourisme.voyageur.UtilisateurService;

import java.util.List;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("null")
public class AvisServiceTest {

    @Mock
    private AvisRepository avisRepository;

    @Mock
    private UtilisateurService utilisateurService;

    @Mock
    private AvisEtablissementService etablissementProvider;

    @InjectMocks
    private AviserviceImpl avisService;

    private Avis testAvis;
    private UtilisateurEntity testUser;
    private Etablissement testEtablissement;
    private UUID avisPublicId;
    private UUID userPublicId;

    @BeforeEach
    void setUp() {
        avisPublicId = UUID.randomUUID();
        userPublicId = UUID.randomUUID();

        testUser = UtilisateurEntity.builder()
                .id(1L)
                .publicId(userPublicId)
                .nomComplet("Jean Test")
                .userEmail("jean@test.cm")
                .userPassword("password123")
                .build();

        testEtablissement = new Etablissement();
        testEtablissement.setId(1L);
        testEtablissement.setPublicId(UUID.randomUUID());
        testEtablissement.setNom("Hotel Test");

        testAvis = new Avis();
        testAvis.setId(1L);
        testAvis.setPublicId(avisPublicId);
        testAvis.setMessage("Super séjour!");
        testAvis.setNote(5);
        testAvis.setAuteur(testUser);
        testAvis.setLieuConcerne(testEtablissement);
        testAvis.setDateCreation(LocalDate.now());
        testAvis.setNombreLikes(0);
        testAvis.setUsersWhoLiked(new HashSet<>());
    }

    // ==================== TESTS SAVE ====================

    @Test
    void save_Success() {
        // Act
        avisService.save(testAvis);

        // Assert
        verify(avisRepository, times(1)).save(testAvis);
    }

    @Test
    void save_NullAvis_ThrowsException() {
        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            avisService.save(null);
        });

        assertEquals("L'avis ne peut pas être null", exception.getMessage());
        verify(avisRepository, never()).save(any());
    }

    // ==================== TESTS EDIT AVIS ====================

    @Test
    void editAvis_Success() {
        // Arrange
        AvisUpdateDto updateDto = AvisUpdateDto.builder()
                .publicId(avisPublicId)
                .message("Message modifié")
                .note(4)
                .build();

        when(avisRepository.findByPublicId(avisPublicId)).thenReturn(Optional.of(testAvis));

        // Act
        avisService.editAvis(userPublicId, updateDto);

        // Assert
        assertEquals("Message modifié", testAvis.getMessage());
        assertEquals(4, testAvis.getNote());
        verify(avisRepository, times(1)).save(testAvis);
    }

    @Test
    void editAvis_NotOwner_ThrowsException() {
        // Arrange
        UUID differentUserId = UUID.randomUUID();
        AvisUpdateDto updateDto = AvisUpdateDto.builder()
                .publicId(avisPublicId)
                .message("Message modifié")
                .note(4)
                .build();

        when(avisRepository.findByPublicId(avisPublicId)).thenReturn(Optional.of(testAvis));

        // Act & Assert
        assertThrows(CommentNotFoundException.class, () -> {
            avisService.editAvis(differentUserId, updateDto);
        });

        verify(avisRepository, never()).save(any());
    }

    @Test
    void editAvis_AvisNotFound_ThrowsException() {
        // Arrange
        AvisUpdateDto updateDto = AvisUpdateDto.builder()
                .publicId(UUID.randomUUID())
                .message("Message")
                .note(4)
                .build();

        when(avisRepository.findByPublicId(any())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(CommentNotFoundException.class, () -> {
            avisService.editAvis(userPublicId, updateDto);
        });
    }

    // ==================== TESTS SUPPRIMER USER AVIS ====================

    @Test
    void supprimerUserAvis_Success() {
        // Arrange
        when(avisRepository.findByPublicId(avisPublicId)).thenReturn(Optional.of(testAvis));

        // Act
        avisService.supprimerUserAvis(userPublicId, avisPublicId);

        // Assert
        verify(avisRepository, times(1)).delete(testAvis);
    }

    @Test
    void supprimerUserAvis_NotOwner_ThrowsException() {
        // Arrange
        UUID differentUserId = UUID.randomUUID();
        when(avisRepository.findByPublicId(avisPublicId)).thenReturn(Optional.of(testAvis));

        // Act & Assert
        assertThrows(CommentNotFoundException.class, () -> {
            avisService.supprimerUserAvis(differentUserId, avisPublicId);
        });

        verify(avisRepository, never()).delete(any());
    }

    // ==================== TESTS TOGGLE LIKE ====================

    @Test
    void toggleLike_AddLike_Success() {
        // Arrange
        when(avisRepository.findByPublicId(avisPublicId)).thenReturn(Optional.of(testAvis));
        when(utilisateurService.findByEmail("jean@test.cm")).thenReturn(testUser);

        // Act
        avisService.toggleLike(avisPublicId, "jean@test.cm");

        // Assert
        assertTrue(testAvis.getUsersWhoLiked().contains(testUser));
        assertEquals(1, testAvis.getNombreLikes());
        verify(avisRepository, times(1)).save(testAvis);
    }

    @Test
    void toggleLike_RemoveLike_Success() {
        // Arrange
        testAvis.getUsersWhoLiked().add(testUser);
        testAvis.setNombreLikes(1);

        when(avisRepository.findByPublicId(avisPublicId)).thenReturn(Optional.of(testAvis));
        when(utilisateurService.findByEmail("jean@test.cm")).thenReturn(testUser);

        // Act
        avisService.toggleLike(avisPublicId, "jean@test.cm");

        // Assert
        assertFalse(testAvis.getUsersWhoLiked().contains(testUser));
        assertEquals(0, testAvis.getNombreLikes());
        verify(avisRepository, times(1)).save(testAvis);
    }

    // ==================== TESTS LISTER AVIS ====================

    @Test
    void listerLesAvisParPublicId_Success() {
        // Arrange
        UUID etablissementPublicId = testEtablissement.getPublicId();
        PageRequest pageable = PageRequest.of(0, 10, Sort.by("dateCreation").descending());
        Page<Avis> avisPage = new PageImpl<>(List.of(testAvis), pageable, 1);

        when(avisRepository.findByLieuConcerne_PublicId(eq(etablissementPublicId), any(PageRequest.class)))
                .thenReturn(avisPage);

        // Act
        var result = avisService.listerLesAvisParPublicId(etablissementPublicId, 0, 10, "dateCreation", "desc");

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Super séjour!", result.getContent().get(0).getMessage());
    }

    @Test
    void getOneAvis_Success() {
        // Arrange
        when(avisRepository.findByPublicId(avisPublicId)).thenReturn(Optional.of(testAvis));

        // Act
        Avis result = avisService.getOneAvis(avisPublicId);

        // Assert
        assertNotNull(result);
        assertEquals(avisPublicId, result.getPublicId());
    }

    @Test
    void getOneAvis_NotFound_ThrowsException() {
        // Arrange
        when(avisRepository.findByPublicId(any())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(CommentNotFoundException.class, () -> {
            avisService.getOneAvis(UUID.randomUUID());
        });
    }
}

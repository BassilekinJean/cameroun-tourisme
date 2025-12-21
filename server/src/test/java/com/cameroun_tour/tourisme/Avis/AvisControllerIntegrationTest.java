package com.cameroun_tour.tourisme.Avis;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.UUID;

/**
 * Tests d'intégration pour AvisController
 * Utilise le profil 'test' avec H2 en mémoire
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AvisControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getAvisByEtablissement_ReturnsPagedResponse() throws Exception {
        // Arrange
        UUID etablissementId = UUID.randomUUID();

        // Act & Assert
        mockMvc.perform(get("/api/avis/all")
                .param("etablissementId", etablissementId.toString())
                .param("page", "0")
                .param("size", "10")
                .param("sortBy", "dateCreation")
                .param("direction", "desc")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.pageable").exists())
                .andExpect(jsonPath("$.totalElements").exists());
    }

    @Test
    void getAvisByUser_ReturnsPagedResponse() throws Exception {
        // Arrange
        UUID userId = UUID.randomUUID();

        // Act & Assert
        mockMvc.perform(get("/api/avis/user")
                .param("userId", userId.toString())
                .param("page", "0")
                .param("size", "10")
                .param("sort", "dateCreation")
                .param("sortDir", "desc")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    void getOneAvis_NotFound_Returns404() throws Exception {
        // Arrange
        UUID randomId = UUID.randomUUID();

        // Act & Assert
        mockMvc.perform(get("/api/avis/{publicId}", randomId)
                .param("publicUuid", randomId.toString())
                .contentType(MediaType.ALL_VALUE))
                .andExpect(status().isNotFound());
    }
}

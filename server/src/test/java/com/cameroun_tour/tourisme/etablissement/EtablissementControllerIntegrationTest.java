package com.cameroun_tour.tourisme.etablissement;

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
 * Tests d'intégration pour EtablissementController
 * Utilise le profil 'test' avec H2 en mémoire
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class EtablissementControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getAllEtablissements_ReturnsPagedResponse() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/lieux")
                .param("page", "0")
                .param("size", "10")
                .param("sortBy", "nom")
                .param("sortDir", "asc")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.pageable").exists());
    }

    @Test
    void getEtablissementByPublicId_NotFound_Returns404() throws Exception {
        // Arrange
        UUID randomId = UUID.randomUUID();

        // Act & Assert
        mockMvc.perform(get("/api/lieux/{publicId}", randomId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void searchEtablissements_ReturnsResults() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/lieux/search")
                .param("query", "hotel")
                .param("page", "0")
                .param("size", "10")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    void getEtablissementsByVille_ReturnsFilteredResults() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/lieux/ville/{ville}", "Yaoundé")
                .param("page", "0")
                .param("size", "10")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }
}

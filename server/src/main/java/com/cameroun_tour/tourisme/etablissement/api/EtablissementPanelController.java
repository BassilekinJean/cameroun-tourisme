package com.cameroun_tour.tourisme.etablissement.api;

import java.util.Map;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cameroun_tour.tourisme.common.contracts.AvisDto;
import com.cameroun_tour.tourisme.etablissement.Etablissement;
import com.cameroun_tour.tourisme.etablissement.model.EtablissementResponse;
import com.cameroun_tour.tourisme.etablissement.model.EtablissementUpdateDto;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Contrôleur pour les gestionnaires d'établissements
 * Permet aux propriétaires/gestionnaires de gérer leur établissement
 */
@RestController
@RequestMapping("/api/etablissement-panel")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ETABLISSEMENT') or hasRole('ADMIN')")
@Tag(name = "Panel Établissement", description = "Gestion d'un établissement par son propriétaire")
public class EtablissementPanelController {

    private final EtablissementPanelService panelService;

    @GetMapping("/my-etablissement")
    @Operation(summary = "Mon établissement", description = "Récupère les informations de l'établissement du gestionnaire connecté")
    public ResponseEntity<EtablissementResponse> getMyEtablissement(Authentication authentication) {
        String email = authentication.getName();
        Etablissement etablissement = panelService.getEtablissementByOwnerEmail(email);
        return ResponseEntity.ok(EtablissementResponse.fromEntity(etablissement));
    }

    @GetMapping("/stats")
    @Operation(summary = "Statistiques", description = "Récupère les statistiques de l'établissement")
    public ResponseEntity<Map<String, Object>> getStats(Authentication authentication) {
        String email = authentication.getName();
        Map<String, Object> stats = panelService.getEtablissementStats(email);
        return ResponseEntity.ok(stats);
    }

    @PutMapping("/update")
    @Operation(summary = "Mettre à jour", description = "Met à jour les informations de l'établissement")
    public ResponseEntity<EtablissementResponse> updateEtablissement(
            Authentication authentication,
            @Valid @RequestBody EtablissementUpdateDto dto) {
        String email = authentication.getName();
        Etablissement updated = panelService.updateEtablissement(email, dto);
        return ResponseEntity.ok(EtablissementResponse.fromEntity(updated));
    }

    @GetMapping(path = "/avis", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Liste des avis", description = "Récupère tous les avis de l'établissement")
    public ResponseEntity<Page<AvisDto>> getAvis(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dateCreation") String sort,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        String email = authentication.getName();
        Page<AvisDto> avis = panelService.getEtablissementAvis(email, page, size, sort, sortDir);
        return ResponseEntity.ok(avis);
    }

    @DeleteMapping("/avis/{avisPublicId}")
    @Operation(summary = "Signaler un avis", description = "Signale un avis pour modération (seul l'admin peut supprimer)")
    public ResponseEntity<Map<String, String>> reportAvis(
            @PathVariable UUID avisPublicId,
            @RequestParam(required = false) String reason) {
        // Pour l'instant, on log le signalement. La suppression reste réservée à l'admin
        return ResponseEntity.ok(Map.of(
            "message", "Avis signalé pour modération",
            "avisId", avisPublicId.toString()
        ));
    }
}

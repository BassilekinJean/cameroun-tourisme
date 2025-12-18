package com.cameroun_tour.tourisme.admin;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cameroun_tour.tourisme.Avis.AvisServiceApi;
import com.cameroun_tour.tourisme.admin.model.AdminStatsResponse;
import com.cameroun_tour.tourisme.common.contracts.AdminAvisDto;
import com.cameroun_tour.tourisme.common.contracts.AdminCreateEtablissementRequest;
import com.cameroun_tour.tourisme.common.contracts.AdminEtablissementDto;
import com.cameroun_tour.tourisme.common.contracts.AdminUpdateEtablissementRequest;
import com.cameroun_tour.tourisme.common.contracts.AdminUpdateUserRequest;
import com.cameroun_tour.tourisme.common.contracts.AdminUserDto;
import com.cameroun_tour.tourisme.common.utils.enums.Role;
import com.cameroun_tour.tourisme.common.utils.enums.TypeLieu;
import com.cameroun_tour.tourisme.etablissement.EtablissementServiceApi;
import com.cameroun_tour.tourisme.voyageur.UtilisateurService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Administration", description = "Endpoints d'administration - Réservés aux administrateurs")
public class AdminController {

    private final UtilisateurService utilisateurService;
    private final EtablissementServiceApi etablissementService;
    private final AvisServiceApi avisService;

    // ==================== STATISTIQUES ====================

    @GetMapping("/stats")
    @Operation(summary = "Statistiques du site", description = "Récupère les statistiques globales du site")
    public ResponseEntity<AdminStatsResponse> getStats() {
        AdminStatsResponse stats = AdminStatsResponse.builder()
                .totalUsers(utilisateurService.countAll())
                .totalEtablissements(etablissementService.countAll())
                .totalAvis(avisService.countAll())
                .totalHotels(etablissementService.countByCategorie(TypeLieu.HOTEL))
                .totalRestaurants(etablissementService.countByCategorie(TypeLieu.RESTAURATION))
                .totalSitesTouristiques(etablissementService.countByCategorie(TypeLieu.SITE_TOURISTIQUE))
                .build();
        return ResponseEntity.ok(stats);
    }

    // ==================== GESTION DES UTILISATEURS ====================

    @GetMapping(path = "/users", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Liste des utilisateurs", description = "Récupère tous les utilisateurs avec pagination")
    public ResponseEntity<Page<AdminUserDto>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dateCreation") String sort,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String search) {
        
        Page<AdminUserDto> users = utilisateurService.searchUsersForAdmin(page, size, sort, sortDir, search);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{publicId}")
    @Operation(summary = "Détails utilisateur", description = "Récupère les détails d'un utilisateur")
    public ResponseEntity<AdminUserDto> getUserById(@PathVariable UUID publicId) {
        AdminUserDto user = utilisateurService.getUserByPublicIdForAdmin(publicId);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/users/{publicId}")
    @Operation(summary = "Modifier utilisateur", description = "Met à jour les informations d'un utilisateur")
    public ResponseEntity<AdminUserDto> updateUser(
            @PathVariable UUID publicId,
            @Valid @RequestBody AdminUpdateUserRequest request) {
        AdminUserDto updatedUser = utilisateurService.updateUserForAdmin(publicId, request);
        return ResponseEntity.ok(updatedUser);
    }

    @PatchMapping("/users/{publicId}/role")
    @Operation(summary = "Changer le rôle", description = "Modifie le rôle d'un utilisateur")
    public ResponseEntity<AdminUserDto> updateUserRole(
            @PathVariable UUID publicId,
            @RequestParam String role) {
        AdminUserDto updatedUser = utilisateurService.updateUserRole(publicId, Role.valueOf(role.toUpperCase()));
        return ResponseEntity.ok(updatedUser);
    }

    @PatchMapping("/users/{publicId}/lock")
    @Operation(summary = "Verrouiller/Déverrouiller", description = "Verrouille ou déverrouille un compte utilisateur")
    public ResponseEntity<Map<String, String>> toggleUserLock(@PathVariable UUID publicId) {
        boolean isLocked = utilisateurService.toggleUserLock(publicId);
        return ResponseEntity.ok(Map.of(
            "message", isLocked ? "Compte verrouillé" : "Compte déverrouillé",
            "locked", String.valueOf(isLocked)
        ));
    }

    @DeleteMapping("/users/{publicId}")
    @Operation(summary = "Supprimer utilisateur", description = "Supprime un compte utilisateur")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID publicId) {
        utilisateurService.deleteUserByPublicId(publicId);
        return ResponseEntity.noContent().build();
    }

    // ==================== GESTION DES ÉTABLISSEMENTS ====================

    @GetMapping(path = "/etablissements", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Liste des établissements", description = "Récupère tous les établissements avec pagination")
    public ResponseEntity<Page<AdminEtablissementDto>> getAllEtablissements(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String search) {
        
        Page<AdminEtablissementDto> etablissements = etablissementService.searchEtablissementsForAdmin(page, size, sort, sortDir, search);
        return ResponseEntity.ok(etablissements);
    }

    @PostMapping("/etablissements")
    @Operation(summary = "Créer un établissement", description = "Crée un nouvel établissement (Admin uniquement)")
    public ResponseEntity<AdminEtablissementDto> createEtablissement(
            @Valid @RequestBody AdminCreateEtablissementRequest request) {
        AdminEtablissementDto created = etablissementService.createEtablissementForAdmin(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/etablissements/{publicId}")
    @Operation(summary = "Modifier établissement", description = "Met à jour les informations d'un établissement")
    public ResponseEntity<AdminEtablissementDto> updateEtablissement(
            @PathVariable UUID publicId,
            @Valid @RequestBody AdminUpdateEtablissementRequest request) {
        AdminEtablissementDto updated = etablissementService.updateEtablissementForAdmin(publicId, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/etablissements/{publicId}")
    @Operation(summary = "Supprimer établissement", description = "Supprime un établissement")
    public ResponseEntity<Void> deleteEtablissement(@PathVariable UUID publicId) {
        etablissementService.deleteEtablissementByPublicId(publicId);
        return ResponseEntity.noContent().build();
    }

    // ==================== GESTION DES AVIS ====================

    @GetMapping(path = "/avis", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Liste des avis", description = "Récupère tous les avis avec pagination")
    public ResponseEntity<Page<AdminAvisDto>> getAllAvis(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dateCreation") String sort,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String search) {
        
        Page<AdminAvisDto> avis = avisService.searchAvisForAdmin(page, size, sort, sortDir, search);
        return ResponseEntity.ok(avis);
    }

    @DeleteMapping("/avis/{publicId}")
    @Operation(summary = "Supprimer un avis", description = "Supprime un avis (modération)")
    public ResponseEntity<Void> deleteAvis(@PathVariable UUID publicId) {
        avisService.deleteAvisByPublicId(publicId);
        return ResponseEntity.noContent().build();
    }

    // ==================== ACTIONS EN LOT ====================

    @DeleteMapping("/users/batch")
    @Operation(summary = "Suppression en lot", description = "Supprime plusieurs utilisateurs")
    public ResponseEntity<Map<String, Integer>> deleteUsersBatch(@RequestBody List<UUID> userIds) {
        int deleted = utilisateurService.deleteUsersBatch(userIds);
        return ResponseEntity.ok(Map.of("deleted", deleted));
    }

    @DeleteMapping("/avis/batch")
    @Operation(summary = "Suppression avis en lot", description = "Supprime plusieurs avis")
    public ResponseEntity<Map<String, Integer>> deleteAvisBatch(@RequestBody List<UUID> avisIds) {
        int deleted = avisService.deleteAvisBatch(avisIds);
        return ResponseEntity.ok(Map.of("deleted", deleted));
    }
}

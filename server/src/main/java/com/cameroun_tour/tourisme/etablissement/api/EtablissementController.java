package com.cameroun_tour.tourisme.etablissement.api;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cameroun_tour.tourisme.Avis.api.AvisRepository;
import com.cameroun_tour.tourisme.common.contracts.AvisCreationDto;
import com.cameroun_tour.tourisme.common.utils.enums.TypeLieu;
import com.cameroun_tour.tourisme.etablissement.Etablissement;
import com.cameroun_tour.tourisme.etablissement.EtablissementServiceApi;
import com.cameroun_tour.tourisme.etablissement.model.EtablissementListItem;
import com.cameroun_tour.tourisme.etablissement.model.EtablissementResponse;
import com.cameroun_tour.tourisme.etablissement.model.LieuRegistrationDto;
import com.cameroun_tour.tourisme.etablissement.model.SearchResult;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/lieux")
@RequiredArgsConstructor
public class EtablissementController {

    private final EtablissementServiceApi etablissementService;
    private final AvisRepository avisRepository;

    /**
     * Convertit un établissement en EtablissementListItem avec le rating calculé
     */
    private EtablissementListItem toListItemWithRating(Etablissement e) {
        Double avgRating = avisRepository.findAverageRatingByEtablissementId(e.getId());
        return EtablissementListItem.builder()
                .publicId(e.getPublicId())
                .nom(e.getNom())
                .description(e.getDescription())
                .ville(e.getVille())
                .photoProfile(e.getPhotoProfile())
                .images(e.getImages())
                .categorie(e.getCategorie())
                .nombreFavoris(e.getNombreFavoris())
                .nombreAvis(e.getNombreFavoris()) // TODO: corriger pour le vrai nombre d'avis
                .rating(avgRating != null ? Math.round(avgRating * 10) / 10.0 : null)
                .build();
    }

    /**
     * Récupérer tous les établissements avec pagination
     * GET /api/lieux?page=0&size=12&categorie=HOTEL
     */
    @GetMapping
    public ResponseEntity<Page<EtablissementListItem>> listerTous(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) TypeLieu categorie) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Etablissement> etablissements;
        
        if (categorie != null) {
            etablissements = etablissementService.findByCategorie(categorie, pageable);
        } else {
            etablissements = etablissementService.findAll(pageable);
        }
        
        Page<EtablissementListItem> response = etablissements.map(this::toListItemWithRating);
        return ResponseEntity.ok(response);
    }

    /**
     * Récupérer un établissement par son publicId
     * GET /api/lieux/{publicId}
     */
    @GetMapping("/{publicId}")
    public ResponseEntity<EtablissementResponse> getById(@PathVariable UUID publicId) {
        Etablissement etablissement = etablissementService.findByPublicId(publicId);
        EtablissementResponse response = EtablissementResponse.fromEntity(etablissement);
        
        // Calculer le rating depuis les avis
        Double avgRating = avisRepository.findAverageRatingByEtablissementId(etablissement.getId());
        response.setRating(avgRating != null ? Math.round(avgRating * 10) / 10.0 : null);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Recherche d'établissements
     * GET /api/lieux/search?q=yaoundé&categorie=HOTEL&ville=Douala&page=0&size=12
     */
    @GetMapping("/search")
    public ResponseEntity<SearchResult> search(
            @RequestParam(name = "q", required = false) String query,
            @RequestParam(required = false) TypeLieu categorie,
            @RequestParam(required = false) String ville,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String sort) {
        
        Sort sortOrder = Sort.by("createdAt").descending();
        if (sort != null) {
            sortOrder = sort.startsWith("-") 
                ? Sort.by(sort.substring(1)).descending() 
                : Sort.by(sort).ascending();
        }
        
        Pageable pageable = PageRequest.of(page, size, sortOrder);
        Page<Etablissement> results = etablissementService.search(query, categorie, ville, pageable);
        
        List<EtablissementListItem> items = results.getContent().stream()
                .map(this::toListItemWithRating)
                .collect(Collectors.toList());
        
        SearchResult searchResult = SearchResult.builder()
                .etablissements(items)
                .totalResults(results.getTotalElements())
                .page(results.getNumber())
                .totalPages(results.getTotalPages())
                .build();
        
        return ResponseEntity.ok(searchResult);
    }

    /**
     * Récupérer les établissements par catégorie
     * GET /api/lieux/categorie/HOTEL?page=0&size=12
     */
    @GetMapping("/categorie/{categorie}")
    public ResponseEntity<Page<EtablissementListItem>> getByCategorie(
            @PathVariable TypeLieu categorie,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Etablissement> etablissements = etablissementService.findByCategorie(categorie, pageable);
        Page<EtablissementListItem> response = etablissements.map(this::toListItemWithRating);
        return ResponseEntity.ok(response);
    }

    /**
     * Récupérer les établissements par ville
     * GET /api/lieux/ville/Yaoundé?page=0&size=12
     */
    @GetMapping("/ville/{ville}")
    public ResponseEntity<Page<EtablissementListItem>> getByVille(
            @PathVariable String ville,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Etablissement> etablissements = etablissementService.findByVille(ville, pageable);
        Page<EtablissementListItem> response = etablissements.map(this::toListItemWithRating);
        return ResponseEntity.ok(response);
    }

    /**
     * Récupérer les établissements populaires
     * GET /api/lieux/popular?size=6
     */
    @GetMapping("/popular")
    public ResponseEntity<List<EtablissementListItem>> getPopular(
            @RequestParam(defaultValue = "6") int size) {
        
        List<Etablissement> etablissements = etablissementService.findPopular(size);
        List<EtablissementListItem> response = etablissements.stream()
                .map(this::toListItemWithRating)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    /**
     * Enregistrer un nouvel établissement
     * POST /api/lieux/register
     */
    @PostMapping("/register")
    public ResponseEntity<Void> registerLieu(@RequestBody @Valid LieuRegistrationDto dto) {
        etablissementService.registerLieu(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    /**
     * Créer un avis sur un établissement
     * POST /api/lieux/{publicId}/post-avis
     */
    @PostMapping("/{publicId}/post-avis")
    public ResponseEntity<Void> creerAvis(
            @PathVariable UUID publicId,
            @RequestBody @Valid AvisCreationDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        Etablissement etablissement = etablissementService.findByPublicId(publicId);
        etablissementService.publierAvis(etablissement.getId(), userDetails.getUsername(), dto);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
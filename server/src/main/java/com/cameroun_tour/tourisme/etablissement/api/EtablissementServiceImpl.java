package com.cameroun_tour.tourisme.etablissement.api;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.cameroun_tour.tourisme.common.contracts.AdminCreateEtablissementRequest;
import com.cameroun_tour.tourisme.common.contracts.AdminEtablissementDto;
import com.cameroun_tour.tourisme.common.contracts.AdminUpdateEtablissementRequest;
import com.cameroun_tour.tourisme.common.contracts.AvisCreationDto;
import com.cameroun_tour.tourisme.common.events.AvisPublieEvent;
import com.cameroun_tour.tourisme.common.utils.enums.TypeLieu;
import com.cameroun_tour.tourisme.etablissement.Etablissement;
import com.cameroun_tour.tourisme.etablissement.EtablissementServiceApi;
import com.cameroun_tour.tourisme.etablissement.errors.LieuNotFoundException;
import com.cameroun_tour.tourisme.etablissement.model.LieuRegistrationDto;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EtablissementServiceImpl implements EtablissementServiceApi {

    private final EtablissementRepository etablissementRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void registerLieu(LieuRegistrationDto dto) {
        if (!dto.password().equals(dto.validatePassword())) {
            throw new IllegalArgumentException("Les mots de passe ne correspondent pas");
        }
        if (etablissementRepository.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("Cet email est déjà utilisé");
        }

        Etablissement etablissement = new Etablissement();
        etablissement.setNom(dto.nom());
        etablissement.setDescription(dto.description());
        etablissement.setEmail(dto.email());
        etablissement.setPassword(passwordEncoder.encode(dto.password()));
        etablissement.setTelephone(dto.telephone());
        etablissement.setPhotoProfile(dto.photoProfile());
        etablissement.setAdresse(dto.adresse());
        etablissement.setVille(dto.ville());
        etablissement.setImages(dto.images());
        etablissement.setCategorie(dto.categorie());
        
        // Ajouter la localisation si fournie
        if (dto.latitude() != null && dto.longitude() != null) {
            etablissement.setLocalisation(new Etablissement.Localisation(dto.latitude(), dto.longitude()));
        }

        etablissementRepository.save(etablissement);
    }

    @Override
    public void save(Etablissement etablissement) {
        if (etablissement == null) {
            throw new LieuNotFoundException("L'établissement ne peut pas être null");
        }
        etablissementRepository.save(etablissement);
    }

    @Override
    public Etablissement findByPublicId(UUID publicId) {
        return etablissementRepository.findByPublicId(publicId)
                .orElseThrow(() -> new EntityNotFoundException("Établissement non trouvé avec l'ID public : " + publicId));
    }

    @Override
    @Transactional
    @SuppressWarnings("null")
    public void publierAvis(Long lieuId, String auteurEmail, AvisCreationDto dto) {
        etablissementRepository.findById(lieuId)
            .orElseThrow(() -> new EntityNotFoundException("Établissement non trouvé avec l'ID : " + lieuId));

        AvisPublieEvent event = new AvisPublieEvent(
            auteurEmail,
            dto.message(),
            lieuId,
            dto.note(),
            LocalDate.now()
        );
        eventPublisher.publishEvent(event);
    }

    @Override
    @SuppressWarnings("null")
    public Etablissement trouverAvecId(Long id) {
        Optional<Etablissement> lieu = etablissementRepository.findById(id);

        return lieu.orElseThrow(() -> 
                            new EntityNotFoundException("Établissement non trouvé avec l'ID : " + id));
    }

    @Override
    @SuppressWarnings("null")
    public Page<Etablissement> findAll(Pageable pageable) {
        return etablissementRepository.findAll(pageable);
    }

    @Override
    public Page<Etablissement> findByCategorie(TypeLieu categorie, Pageable pageable) {
        return etablissementRepository.findByCategorie(categorie, pageable);
    }

    @Override
    public Page<Etablissement> findByVille(String ville, Pageable pageable) {
        return etablissementRepository.findByVilleContainingIgnoreCase(ville, pageable);
    }

    @Override
    @SuppressWarnings("null")
    public Page<Etablissement> search(String query, TypeLieu categorie, String ville, Pageable pageable) {
        // Si aucun filtre, recherche simple
        if (query == null || query.isBlank()) {
            if (categorie != null) {
                return etablissementRepository.findByCategorie(categorie, pageable);
            }
            if (ville != null && !ville.isBlank()) {
                return etablissementRepository.findByVilleContainingIgnoreCase(ville, pageable);
            }
            return etablissementRepository.findAll(pageable);
        }

        // Recherche avec query
        if (categorie != null) {
            return etablissementRepository.searchByQueryAndCategorie(query, categorie, pageable);
        }
        if (ville != null && !ville.isBlank()) {
            return etablissementRepository.searchByQueryAndVille(query, ville, pageable);
        }
        return etablissementRepository.searchByQuery(query, pageable);
    }

    @Override
    public List<Etablissement> findPopular(int limit) {
        return etablissementRepository.findTopByOrderByNombreFavorisDesc(PageRequest.of(0, limit));
    }

    // ==================== MÉTHODES ADMIN ====================

    @Override
    public long countAll() {
        return etablissementRepository.count();
    }

    @Override
    public long countByCategorie(TypeLieu categorie) {
        return etablissementRepository.countByCategorie(categorie);
    }

    @Override
    public Page<AdminEtablissementDto> searchEtablissementsForAdmin(int page, int size, String sort, String sortDir, String search) {
        Sort sortOrder = sortDir.equalsIgnoreCase("asc") 
            ? Sort.by(sort).ascending() 
            : Sort.by(sort).descending();
        
        PageRequest pageable = PageRequest.of(page, size, sortOrder);
        
        Page<Etablissement> etablissements;
        if (search != null && !search.isBlank()) {
            etablissements = etablissementRepository.searchByQuery(search, pageable);
        } else {
            etablissements = etablissementRepository.findAll(pageable);
        }
        
        return etablissements.map(this::toAdminEtablissementDto);
    }

    @Override
    @Transactional
    public AdminEtablissementDto createEtablissementForAdmin(AdminCreateEtablissementRequest request) {
        if (etablissementRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Cet email est déjà utilisé");
        }

        Etablissement etablissement = new Etablissement();
        etablissement.setNom(request.nom());
        etablissement.setDescription(request.description());
        etablissement.setEmail(request.email());
        etablissement.setPassword(passwordEncoder.encode(request.password()));
        etablissement.setTelephone(request.telephone());
        etablissement.setPhotoProfile(request.photoProfile());
        etablissement.setAdresse(request.adresse());
        etablissement.setVille(request.ville());
        etablissement.setImages(request.images());
        etablissement.setCategorie(request.categorie());
        
        if (request.latitude() != null && request.longitude() != null) {
            etablissement.setLocalisation(new Etablissement.Localisation(request.latitude(), request.longitude()));
        }

        Etablissement saved = etablissementRepository.save(etablissement);
        return toAdminEtablissementDto(saved);
    }

    @Override
    @Transactional
    public AdminEtablissementDto updateEtablissementForAdmin(UUID publicId, AdminUpdateEtablissementRequest request) {
        Etablissement etablissement = etablissementRepository.findByPublicId(publicId)
                .orElseThrow(() -> new EntityNotFoundException("Établissement non trouvé avec l'ID: " + publicId));
        
        if (request.nom() != null) {
            etablissement.setNom(request.nom());
        }
        if (request.description() != null) {
            etablissement.setDescription(request.description());
        }
        if (request.email() != null) {
            etablissement.setEmail(request.email());
        }
        if (request.telephone() != null) {
            etablissement.setTelephone(request.telephone());
        }
        if (request.adresse() != null) {
            etablissement.setAdresse(request.adresse());
        }
        if (request.ville() != null) {
            etablissement.setVille(request.ville());
        }
        if (request.categorie() != null) {
            etablissement.setCategorie(request.categorie());
        }
        if (request.images() != null) {
            etablissement.setImages(request.images());
        }
        if (request.photoProfile() != null) {
            etablissement.setPhotoProfile(request.photoProfile());
        }
        if (request.latitude() != null && request.longitude() != null) {
            etablissement.setLocalisation(new Etablissement.Localisation(request.latitude(), request.longitude()));
        }
        
        Etablissement saved = etablissementRepository.save(etablissement);
        return toAdminEtablissementDto(saved);
    }

    @Override
    @Transactional
    public void deleteEtablissementByPublicId(UUID publicId) {
        Etablissement etablissement = etablissementRepository.findByPublicId(publicId)
                .orElseThrow(() -> new EntityNotFoundException("Établissement non trouvé avec l'ID: " + publicId));
        etablissementRepository.delete(etablissement);
    }

    @Override
    public boolean existsByEmail(String email) {
        return etablissementRepository.existsByEmail(email);
    }

    /**
     * Convertit une entité Etablissement en AdminEtablissementDto
     */
    private AdminEtablissementDto toAdminEtablissementDto(Etablissement etablissement) {
        return AdminEtablissementDto.builder()
                .publicId(etablissement.getPublicId())
                .nom(etablissement.getNom())
                .description(etablissement.getDescription())
                .email(etablissement.getEmail())
                .telephone(etablissement.getTelephone())
                .adresse(etablissement.getAdresse())
                .ville(etablissement.getVille())
                .photoProfile(etablissement.getPhotoProfile())
                .images(etablissement.getImages())
                .categorie(etablissement.getCategorie())
                .latitude(etablissement.getLocalisation() != null ? etablissement.getLocalisation().getLatitude() : null)
                .longitude(etablissement.getLocalisation() != null ? etablissement.getLocalisation().getLongitude() : null)
                .nombreFavoris(etablissement.getNombreFavoris())
                .nombreAvis(0) // À calculer depuis le module Avis si nécessaire
                .rating(null) // À calculer si nécessaire
                .build();
    }
}

package com.cameroun_tour.tourisme.etablissement.api;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
    
}

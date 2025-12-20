package com.cameroun_tour.tourisme.etablissement.api;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cameroun_tour.tourisme.Avis.Avis;
import com.cameroun_tour.tourisme.Avis.AvisServiceApi;
import com.cameroun_tour.tourisme.etablissement.Etablissement;
import com.cameroun_tour.tourisme.etablissement.model.EtablissementUpdateDto;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EtablissementPanelServiceImpl implements EtablissementPanelService {

    private final EtablissementRepository etablissementRepository;
    private final AvisServiceApi avisService;

    @Override
    @Transactional(readOnly = true)
    public Etablissement getEtablissementByOwnerEmail(String email) {
        return etablissementRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Aucun établissement trouvé pour cet email: " + email));
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getEtablissementStats(String ownerEmail) {
        Etablissement etablissement = getEtablissementByOwnerEmail(ownerEmail);
        
        // Compter les avis
        long totalAvis = avisService.listerLesAvisLieu(etablissement.getId(), PageRequest.of(0, 1)).getTotalElements();
        
        // Calculer la note moyenne
        Page<Avis> allAvis = avisService.listerLesAvisLieu(etablissement.getId(), PageRequest.of(0, 1000));
        double avgRating = allAvis.getContent().stream()
                .mapToInt(Avis::getNote)
                .average()
                .orElse(0.0);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalAvis", totalAvis);
        stats.put("nombreFavoris", etablissement.getNombreFavoris());
        stats.put("noteMoyenne", Math.round(avgRating * 10) / 10.0);
        stats.put("etablissementId", etablissement.getPublicId());
        stats.put("nom", etablissement.getNom());
        
        return stats;
    }

    @Override
    @Transactional
    public Etablissement updateEtablissement(String ownerEmail, EtablissementUpdateDto dto) {
        Etablissement etablissement = getEtablissementByOwnerEmail(ownerEmail);
        
        if (dto.description() != null) {
            etablissement.setDescription(dto.description());
        }
        if (dto.telephone() != null) {
            etablissement.setTelephone(dto.telephone());
        }
        if (dto.adresse() != null) {
            etablissement.setAdresse(dto.adresse());
        }
        if (dto.photoProfile() != null) {
            etablissement.setPhotoProfile(dto.photoProfile());
        }
        if (dto.images() != null && !dto.images().isEmpty()) {
            etablissement.setImages(dto.images());
        }
        if (dto.latitude() != null && dto.longitude() != null) {
            etablissement.setLocalisation(new Etablissement.Localisation(dto.latitude(), dto.longitude()));
        }
        
        return etablissementRepository.save(etablissement);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Avis> getEtablissementAvis(String ownerEmail, int page, int size, String sort, String sortDir) {
        Etablissement etablissement = getEtablissementByOwnerEmail(ownerEmail);
        
        Sort sortOrder = sortDir.equalsIgnoreCase("asc") 
            ? Sort.by(sort).ascending() 
            : Sort.by(sort).descending();
        
        PageRequest pageable = PageRequest.of(page, size, sortOrder);
        
        return avisService.listerLesAvisLieu(etablissement.getId(), pageable);
    }
}

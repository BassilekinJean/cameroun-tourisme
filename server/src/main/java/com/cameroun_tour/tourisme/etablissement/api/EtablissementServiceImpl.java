package com.cameroun_tour.tourisme.etablissement.api;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.cameroun_tour.tourisme.common.contracts.AvisCreationDto;
import com.cameroun_tour.tourisme.common.events.AvisPublieEvent;
import com.cameroun_tour.tourisme.etablissement.Etablissement;
import com.cameroun_tour.tourisme.etablissement.EtablissementServiceApi;
import com.cameroun_tour.tourisme.etablissement.Etablissement;
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
    public Etablissement findByPublicId(java.util.UUID publicId) {
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
    public List<Etablissement> listerTousLesEtablissements() {
        return etablissementRepository.findAll();
    }
    
}

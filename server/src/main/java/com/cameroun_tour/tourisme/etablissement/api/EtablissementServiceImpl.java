package com.cameroun_tour.tourisme.etablissement.api;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import com.cameroun_tour.tourisme.common.contracts.AvisCreationDto;
import com.cameroun_tour.tourisme.common.events.AvisPublieEvent;
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

    @Override
    public void registerLieu(LieuRegistrationDto dto) {

        
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
    
}

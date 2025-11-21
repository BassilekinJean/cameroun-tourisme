package com.cameroun_tour.tourisme.etablissement.api;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import com.cameroun_tour.tourisme.common.contracts.CommentaireCreationDto;
import com.cameroun_tour.tourisme.common.events.CommentairePublieEvent;
import com.cameroun_tour.tourisme.etablissement.EtablissementServiceApi;
import com.cameroun_tour.tourisme.etablissement.Lieu;
import com.cameroun_tour.tourisme.etablissement.model.LieuRegistrationDto;

import jakarta.persistence.EntityNotFoundException;
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
    public void publierCommentaire(Long lieuId, String auteurEmail, CommentaireCreationDto dto) {
        etablissementRepository.findById(lieuId)
            .orElseThrow(() -> new EntityNotFoundException("Établissement non trouvé avec l'ID : " + lieuId));

        CommentairePublieEvent event = new CommentairePublieEvent(
            auteurEmail,
            dto.message(),
            lieuId,
            dto.note(),
            LocalDateTime.now()
        );
        eventPublisher.publishEvent(event);
    }

    @Override
    public Lieu findById(Long id) {
        Optional<Lieu> lieu = etablissementRepository.findById(id);

        return lieu.orElseThrow(() -> 
                            new EntityNotFoundException("Établissement non trouvé avec l'ID : " + id));
    }
    
}

package com.cameroun_tour.tourisme.evaluation.api;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cameroun_tour.tourisme.evaluation.Commentaire;
import com.cameroun_tour.tourisme.evaluation.CommentaireServiceApi;

import lombok.RequiredArgsConstructor;

import org.springframework.http.MediaType;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/comment")
@RequiredArgsConstructor
public class CommentaireController {

    private final CommentaireServiceApi commentaireService;
    
    @GetMapping(path = "/all", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Page<Commentaire>> listerLesCommentairesDunLieu(@RequestParam Long lieuId,
                                                                            @RequestParam int page, 
                                                                            @RequestParam int size, 
                                                                            @RequestParam String sort, 
                                                                            @RequestParam String sortDir)
    {
        return ResponseEntity.ok().body(commentaireService.listerLesCommentairesLieu(lieuId, page, size, sort, sortDir));
    }
    
    
}

package com.cameroun_tour.tourisme.media.model;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CurrentTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entité représentant une image/média stockée
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "images")
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, updatable = false)
    @Builder.Default
    private UUID publicId = UUID.randomUUID();

    @NotBlank(message = "Le nom du fichier est obligatoire")
    private String filename;

    @NotBlank(message = "Le nom original est obligatoire")
    private String originalFilename;

    @NotBlank(message = "Le type MIME est obligatoire")
    private String mimeType;

    @Column(nullable = false)
    private Long size;

    @NotBlank(message = "L'URL de stockage est obligatoire")
    private String storageUrl;

    /**
     * Type de ressource associée à l'image
     */
    @Enumerated(EnumType.STRING)
    private ImageResourceType resourceType;

    /**
     * ID de la ressource associée (établissement, utilisateur, etc.)
     */
    private UUID resourceId;

    /**
     * Email de l'utilisateur qui a uploadé l'image
     */
    private String uploadedBy;

    @CurrentTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    /**
     * Types de ressources auxquelles une image peut être associée
     */
    public enum ImageResourceType {
        ETABLISSEMENT,
        VOYAGEUR,
        AVIS
    }
}

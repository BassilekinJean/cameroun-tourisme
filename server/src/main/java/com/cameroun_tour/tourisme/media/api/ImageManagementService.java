package com.cameroun_tour.tourisme.media.api;

import java.util.List;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import com.cameroun_tour.tourisme.media.model.Image;
import com.cameroun_tour.tourisme.media.model.Image.ImageResourceType;

/**
 * Service de gestion des images/médias
 */
public interface ImageManagementService {

    /**
     * Upload une image
     * @param file Le fichier à uploader
     * @param resourceType Type de ressource associée
     * @param resourceId ID de la ressource associée
     * @param uploaderEmail Email de l'utilisateur qui upload
     * @return L'image créée
     */
    Image uploadImage(MultipartFile file, ImageResourceType resourceType, UUID resourceId, String uploaderEmail);

    /**
     * Récupère une image par son publicId
     */
    Image getByPublicId(UUID publicId);

    /**
     * Récupère les images associées à une ressource
     */
    List<Image> getByResource(ImageResourceType resourceType, UUID resourceId);

    /**
     * Récupère les images uploadées par un utilisateur
     */
    List<Image> getByUploader(String email);

    /**
     * Supprime une image
     */
    void deleteImage(UUID publicId, String requesterEmail);

    /**
     * Vérifie si le type MIME est autorisé
     */
    boolean isAllowedMimeType(String mimeType);
}

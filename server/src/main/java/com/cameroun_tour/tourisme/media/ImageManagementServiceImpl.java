package com.cameroun_tour.tourisme.media;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cameroun_tour.tourisme.media.api.ImageManagementService;
import com.cameroun_tour.tourisme.media.api.ImageRepository;
import com.cameroun_tour.tourisme.media.model.Image;
import com.cameroun_tour.tourisme.media.model.Image.ImageResourceType;

import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Implémentation du service de gestion des images
 * Stockage local sur le filesystem
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ImageManagementServiceImpl implements ImageManagementService {

    private final ImageRepository imageRepository;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Value("${app.upload.base-url:http://localhost:8080/api/media}")
    private String baseUrl;

    private static final Set<String> ALLOWED_MIME_TYPES = Set.of(
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp"
    );

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    @PostConstruct
    public void init() {
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                log.info("Répertoire d'upload créé: {}", uploadPath.toAbsolutePath());
            }
        } catch (IOException e) {
            log.error("Impossible de créer le répertoire d'upload", e);
            throw new RuntimeException("Impossible de créer le répertoire d'upload", e);
        }
    }

    @Override
    @Transactional
    @SuppressWarnings("null")
    public Image uploadImage(MultipartFile file, ImageResourceType resourceType, UUID resourceId, String uploaderEmail) {
        // Validation du fichier
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Le fichier est vide ou null");
        }

        String mimeType = file.getContentType();
        if (!isAllowedMimeType(mimeType)) {
            throw new IllegalArgumentException("Type de fichier non autorisé: " + mimeType);
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("Fichier trop volumineux (max 5MB)");
        }

        // Générer un nom de fichier unique
        String originalFilename = file.getOriginalFilename();
        String extension = getFileExtension(originalFilename);
        String uniqueFilename = UUID.randomUUID().toString() + extension;

        // Sauvegarder le fichier
        Path filePath = Paths.get(uploadDir, uniqueFilename);
        try {
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            log.info("Fichier sauvegardé: {}", filePath);
        } catch (IOException e) {
            log.error("Erreur lors de la sauvegarde du fichier", e);
            throw new RuntimeException("Erreur lors de la sauvegarde du fichier", e);
        }

        // Créer l'entité Image
        Image image = Image.builder()
                .filename(uniqueFilename)
                .originalFilename(originalFilename)
                .mimeType(mimeType)
                .size(file.getSize())
                .storageUrl(baseUrl + "/" + uniqueFilename)
                .resourceType(resourceType)
                .resourceId(resourceId)
                .uploadedBy(uploaderEmail)
                .build();

        return imageRepository.save(image);
    }

    @Override
    public Image getByPublicId(UUID publicId) {
        return imageRepository.findByPublicId(publicId)
                .orElseThrow(() -> new EntityNotFoundException("Image non trouvée: " + publicId));
    }

    @Override
    public List<Image> getByResource(ImageResourceType resourceType, UUID resourceId) {
        return imageRepository.findByResourceTypeAndResourceId(resourceType, resourceId);
    }

    @Override
    public List<Image> getByUploader(String email) {
        return imageRepository.findByUploadedBy(email);
    }

    @Override
    @Transactional
    public void deleteImage(UUID publicId, String requesterEmail) {
        Image image = getByPublicId(publicId);
        
        // Vérifier que l'utilisateur est autorisé à supprimer
        if (!image.getUploadedBy().equals(requesterEmail)) {
            throw new IllegalArgumentException("Non autorisé à supprimer cette image");
        }

        // Supprimer le fichier du filesystem
        Path filePath = Paths.get(uploadDir, image.getFilename());
        try {
            Files.deleteIfExists(filePath);
            log.info("Fichier supprimé: {}", filePath);
        } catch (IOException e) {
            log.error("Erreur lors de la suppression du fichier", e);
        }

        // Supprimer de la base de données
        imageRepository.deleteByPublicId(publicId);
    }

    @Override
    public boolean isAllowedMimeType(String mimeType) {
        return mimeType != null && ALLOWED_MIME_TYPES.contains(mimeType.toLowerCase());
    }

    /**
     * Récupère le contenu d'une image pour le streaming
     */
    public byte[] getImageContent(String filename) throws IOException {
        Path filePath = Paths.get(uploadDir, filename);
        if (!Files.exists(filePath)) {
            throw new EntityNotFoundException("Fichier non trouvé: " + filename);
        }
        return Files.readAllBytes(filePath);
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf("."));
    }
}

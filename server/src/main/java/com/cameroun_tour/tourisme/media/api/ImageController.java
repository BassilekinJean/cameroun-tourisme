package com.cameroun_tour.tourisme.media.api;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.cameroun_tour.tourisme.media.ImageManagementServiceImpl;
import com.cameroun_tour.tourisme.media.model.Image;
import com.cameroun_tour.tourisme.media.model.Image.ImageResourceType;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Controller REST pour la gestion des images/médias
 */
@Slf4j
@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class ImageController {

    private final ImageManagementServiceImpl imageService;

    /**
     * Upload une ou plusieurs images
     * POST /api/media/upload
     */
    @PostMapping("/upload")
    public ResponseEntity<List<ImageResponse>> uploadImages(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam(required = false) ImageResourceType resourceType,
            @RequestParam(required = false) UUID resourceId,
            @AuthenticationPrincipal UserDetails userDetails) {

        List<ImageResponse> responses = files.stream()
                .map(file -> {
                    Image image = imageService.uploadImage(
                            file,
                            resourceType,
                            resourceId,
                            userDetails.getUsername()
                    );
                    return ImageResponse.fromEntity(image);
                })
                .collect(Collectors.toList());

        return ResponseEntity.status(HttpStatus.CREATED).body(responses);
    }

    /**
     * Récupère les métadonnées d'une image
     * GET /api/media/{publicId}
     */
    @GetMapping("/{publicId}")
    public ResponseEntity<ImageResponse> getImageInfo(@PathVariable UUID publicId) {
        Image image = imageService.getByPublicId(publicId);
        return ResponseEntity.ok(ImageResponse.fromEntity(image));
    }

    /**
     * Récupère le contenu binaire d'une image pour l'afficher
     * GET /api/media/file/{filename}
     */
    @GetMapping("/file/{filename}")
    @SuppressWarnings("null")
    public ResponseEntity<byte[]> getImageContent(@PathVariable String filename) {
        try {
            byte[] content = imageService.getImageContent(filename);
            Image image = imageService.getByPublicId(
                    UUID.fromString(filename.substring(0, filename.lastIndexOf(".")))
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(
                    image != null ? image.getMimeType() : "image/jpeg"
            ));
            headers.setContentLength(content.length);

            return new ResponseEntity<>(content, headers, HttpStatus.OK);
        } catch (IOException e) {
            log.error("Erreur lors de la récupération de l'image", e);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            // Si on ne trouve pas l'image dans la DB, on essaie quand même de la servir
            try {
                byte[] content = imageService.getImageContent(filename);
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.IMAGE_JPEG);
                return new ResponseEntity<>(content, headers, HttpStatus.OK);
            } catch (IOException ex) {
                return ResponseEntity.notFound().build();
            }
        }
    }

    /**
     * Récupère les images d'une ressource
     * GET /api/media/resource/{resourceType}/{resourceId}
     */
    @GetMapping("/resource/{resourceType}/{resourceId}")
    public ResponseEntity<List<ImageResponse>> getByResource(
            @PathVariable ImageResourceType resourceType,
            @PathVariable UUID resourceId) {

        List<ImageResponse> responses = imageService.getByResource(resourceType, resourceId)
                .stream()
                .map(ImageResponse::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    /**
     * Récupère une photo de profil utilisateur
     * GET /api/media/profiles/{filename}
     */
    @GetMapping("/profiles/{filename}")
    public ResponseEntity<byte[]> getProfilePhoto(@PathVariable String filename) {
        try {
            java.nio.file.Path filePath = java.nio.file.Paths.get("uploads/profiles").resolve(filename);
            if (!java.nio.file.Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }
            
            byte[] content = java.nio.file.Files.readAllBytes(filePath);
            
            // Déterminer le type MIME
            String mimeType = "image/jpeg";
            if (filename.toLowerCase().endsWith(".png")) {
                mimeType = "image/png";
            } else if (filename.toLowerCase().endsWith(".gif")) {
                mimeType = "image/gif";
            } else if (filename.toLowerCase().endsWith(".webp")) {
                mimeType = "image/webp";
            }
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(mimeType));
            headers.setContentLength(content.length);
            
            return new ResponseEntity<>(content, headers, HttpStatus.OK);
        } catch (IOException e) {
            log.error("Erreur lors de la récupération de la photo de profil", e);
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Récupère les images uploadées par l'utilisateur connecté
     * GET /api/media/my-uploads
     */
    @GetMapping("/my-uploads")
    public ResponseEntity<List<ImageResponse>> getMyUploads(
            @AuthenticationPrincipal UserDetails userDetails) {

        List<ImageResponse> responses = imageService.getByUploader(userDetails.getUsername())
                .stream()
                .map(ImageResponse::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    /**
     * Supprime une image
     * DELETE /api/media/{publicId}
     */
    @DeleteMapping("/{publicId}")
    public ResponseEntity<Void> deleteImage(
            @PathVariable UUID publicId,
            @AuthenticationPrincipal UserDetails userDetails) {

        imageService.deleteImage(publicId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    /**
     * DTO de réponse pour les images
     */
    public record ImageResponse(
            UUID publicId,
            String url,
            String filename,
            String originalFilename,
            String mimeType,
            Long size,
            String uploadedAt
    ) {
        public static ImageResponse fromEntity(Image image) {
            return new ImageResponse(
                    image.getPublicId(),
                    image.getStorageUrl(),
                    image.getFilename(),
                    image.getOriginalFilename(),
                    image.getMimeType(),
                    image.getSize(),
                    image.getCreatedAt() != null ? image.getCreatedAt().toString() : null
            );
        }
    }
}

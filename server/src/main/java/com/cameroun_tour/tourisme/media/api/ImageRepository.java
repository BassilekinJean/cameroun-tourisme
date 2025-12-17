package com.cameroun_tour.tourisme.media.api;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cameroun_tour.tourisme.media.model.Image;
import com.cameroun_tour.tourisme.media.model.Image.ImageResourceType;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {

    Optional<Image> findByPublicId(UUID publicId);

    List<Image> findByResourceTypeAndResourceId(ImageResourceType resourceType, UUID resourceId);

    List<Image> findByUploadedBy(String email);

    void deleteByPublicId(UUID publicId);
}

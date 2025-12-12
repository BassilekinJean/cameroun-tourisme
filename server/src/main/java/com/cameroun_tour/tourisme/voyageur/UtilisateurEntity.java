package com.cameroun_tour.tourisme.voyageur;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.HashSet;

import org.hibernate.annotations.CurrentTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.cameroun_tour.tourisme.common.utils.enums.Role;
import com.cameroun_tour.tourisme.etablissement.Etablissement;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class UtilisateurEntity implements UserDetails{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, updatable = false)
    @Builder.Default
    private UUID publicId = UUID.randomUUID();

    @NotBlank(message = "Le nom est obligatoire")
    private String nomComplet;

    @Column(nullable = false, unique = true)
    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format d'email invalide")
    private String userEmail;

    @Column(nullable = false)
    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères")
    private String userPassword;

    private String paysOrigine;

    private String photoProfile;

    @Builder.Default
    @Column(nullable = false)
    private int failedAttempt = 0;

    private LocalDateTime lockTime;

    @Builder.Default
    private boolean accountLocked = false; 

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;


    @ManyToMany
    @JoinTable(
            name = "user_favoris", 
            joinColumns = @JoinColumn(name = "utilisateur_entity_id"),
            inverseJoinColumns = @JoinColumn(name = "etablissement_public_id"))
    @Builder.Default
    private Set<Etablissement> favoris = new HashSet<>();

    @CurrentTimestamp
    @Column(updatable = false)
    private LocalDateTime dateCreation;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }
    @Override
    public String getPassword() {
        return this.userPassword;
    }
    @Override
    public String getUsername() {
        return this.userEmail;
    }
}

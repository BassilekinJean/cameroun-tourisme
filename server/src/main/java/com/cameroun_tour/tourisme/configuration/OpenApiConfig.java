package com.cameroun_tour.tourisme.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("CamerTrip - API Tourisme Cameroun")
                        .description("API REST pour l'application de tourisme au Cameroun. " +
                                "Cette API permet de gérer les utilisateurs, les établissements touristiques, " +
                                "les avis et les médias.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Équipe CamerTrip")
                                .email("contact@camertrip.cm")
                                .url("https://camertrip.cm"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8080")
                                .description("Serveur de développement"),
                        new Server()
                                .url("https://api.camertrip.cm")
                                .description("Serveur de production")))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Token JWT pour l'authentification. " +
                                        "Obtenu via /api/auth/login")))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
    }
}

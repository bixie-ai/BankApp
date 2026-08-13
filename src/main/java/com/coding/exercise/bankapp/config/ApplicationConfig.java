package com.coding.exercise.bankapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

/**
 * Application-level bean configuration for cross-cutting concerns.
 *
 * <p>Registers the OpenAPI specification metadata exposed at {@code /v3/api-docs}
 * and rendered by the Swagger UI.</p>
 */
@Configuration
public class ApplicationConfig {

    /**
     * Provides the OpenAPI descriptor used by SpringDoc to generate interactive API documentation.
     *
     * @return configured {@link OpenAPI} instance with title, description, and version metadata
     */
    @Bean
    public OpenAPI bankAppOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("BANKING APPLICATION REST API")
                        .description("API for Banking Application.")
                        .version("1.0.0"));
    }
}

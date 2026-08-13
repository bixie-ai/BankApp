package com.coding.exercise.bankapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * HTTP security configuration for the banking API.
 *
 * <p>Enforces HTTP Basic authentication on all business endpoints while permitting
 * unauthenticated access to development tools (H2 Console, Swagger UI, OpenAPI spec).
 * CSRF is disabled because the API is stateless and consumed by non-browser clients.</p>
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Builds the security filter chain that protects all request paths.
     *
     * <p>Public paths: {@code /h2-console/**}, {@code /swagger-ui/**}, {@code /v3/api-docs/**}.
     * All other requests require valid HTTP Basic credentials configured in application.yml.</p>
     *
     * @param http the {@link HttpSecurity} builder provided by Spring Security
     * @return the fully configured {@link SecurityFilterChain}
     * @throws Exception if security configuration fails
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
                .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .headers(headers -> headers.frameOptions(frame -> frame.disable()));

        return http.build();
    }
}

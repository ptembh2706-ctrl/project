package com.etour.app.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import jakarta.servlet.http.HttpServletResponse;

@Configuration
public class SecurityConfig {

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
                return config.getAuthenticationManager();
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtFilter,
                        @org.springframework.beans.factory.annotation.Autowired(required = false) com.etour.app.security.OAuth2LoginSuccessHandler oauth2LoginSuccessHandler)
                        throws Exception {
                http
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .csrf(csrf -> csrf.disable())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authorizeHttpRequests(auth -> auth
                                                // Public Auth & System Endpoints
                                                .requestMatchers("/api/auth/**", "/api/customers/register",
                                                                "/api/customers/login",
                                                                "/api/i18n/**", "/login/oauth2/**", "/oauth2/**",
                                                                "/images/**", "/actuator/**")
                                                .permitAll()

                                                // Public Browsing Endpoints (GET Only)
                                                .requestMatchers(org.springframework.http.HttpMethod.GET,
                                                                "/api/categories/**",
                                                                "/api/tours/**",
                                                                "/api/itineraries/**",
                                                                "/api/search/**",
                                                                "/api/destinations/**",
                                                                "/api/departures/**",
                                                                "/api/costs/**")
                                                .permitAll()

                                                // Protected Endpoints (Bookings, Customers, etc.)
                                                .anyRequest().authenticated())
                                .oauth2Login(oauth2 -> {
                                        if (oauth2LoginSuccessHandler != null) {
                                                oauth2.successHandler(oauth2LoginSuccessHandler);
                                        }
                                })
                                .exceptionHandling(e -> e
                                                .authenticationEntryPoint((request, response, authException) -> {
                                                        // For API requests, return 401 instead of redirecting
                                                        if (request.getRequestURI().startsWith("/api/")) {
                                                                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                                                                response.setContentType("application/json");
                                                                response.getWriter().write(
                                                                                "{\"error\": \"Unauthorized\", \"message\": \""
                                                                                                + authException.getMessage()
                                                                                                + "\"}");
                                                        } else {
                                                                // For other requests, let Spring Security handle it
                                                                // (e.g. redirect)
                                                                response.sendRedirect("/login");
                                                        }
                                                }))
                                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOrigins(List.of("http://localhost:5173"));
                configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                configuration.setAllowedHeaders(List.of("*"));
                configuration.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }
}

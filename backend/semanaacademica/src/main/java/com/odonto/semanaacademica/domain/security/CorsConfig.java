package com.odonto.semanaacademica.domain.security;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
// Dev local (Vite)
                        .allowedOriginPatterns(
                                "http://localhost:*",
                                "http://127.0.0.1:*",
// Produção (qualquer subdomínio do Vercel)
                                "https://*.vercel.app"
                        )
                        .allowedMethods("GET","POST","PUT","PATCH","DELETE","OPTIONS")
                        .allowedHeaders("*");
// Se um dia usar cookies/sessão: adicione .allowCredentials(true)
            }
        };
    }
}
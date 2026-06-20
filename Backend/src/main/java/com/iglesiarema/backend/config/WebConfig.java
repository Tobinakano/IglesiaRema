package com.iglesiarema.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private SessionInterceptor sessionInterceptor;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                    "https://iglesia-rema.vercel.app", 
                    "http://localhost:5173", 
                    "http://localhost:5000", 
                    "http://localhost:3000",
                    "http://localhost:80"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("Content-Type", "Authorization")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Define directory path relative to current running folder
        File flayersDir = new File("uploads/flayers");
        String absolutePath = flayersDir.getAbsolutePath();
        
        // Ensure trailing slash for Spring resource loader
        if (!absolutePath.endsWith(File.separator)) {
            absolutePath += File.separator;
        }
        
        registry.addResourceHandler("/uploads/flayers/**")
                .addResourceLocations("file:" + absolutePath);
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(sessionInterceptor)
                .addPathPatterns("/api/**")
                .excludePathPatterns(
                    "/api/login",
                    "/api/auth",
                    "/api/logout",
                    "/api/session",
                    "/api/flayers",      // GET /api/flayers, POST /api/flayers
                    "/api/flayers/**"    // other flayers endpoints
                );
    }
}

package com.iglesiarema.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;

@Configuration
public class DatabaseConfig {

    @Value("${DATABASE_URL:#{null}}")
    private String databaseUrl;

    @Bean
    public DataSource dataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        
        if (databaseUrl != null && !databaseUrl.trim().isEmpty()) {
            try {
                System.out.println("🔌 Configurando base de datos PostgreSQL de producción...");
                // Database URL format: postgres://user:pass@host:port/dbname
                String cleanUrl = databaseUrl.replace("postgresql://", "postgres://");
                URI dbUri = new URI(cleanUrl);
                
                String username = dbUri.getUserInfo().split(":")[0];
                String password = dbUri.getUserInfo().split(":")[1];
                String dbUrl = "jdbc:postgresql://" + dbUri.getHost() + ":" + dbUri.getPort() + dbUri.getPath();
                
                // Add SSL parameters to URL if not already present
                if (!dbUrl.contains("?")) {
                    dbUrl += "?sslmode=require";
                }

                dataSource.setDriverClassName("org.postgresql.Driver");
                dataSource.setUrl(dbUrl);
                dataSource.setUsername(username);
                dataSource.setPassword(password);
                
                System.out.println("✅ Conectado a PostgreSQL en: " + dbUri.getHost() + dbUri.getPath());
            } catch (URISyntaxException | NullPointerException e) {
                System.err.println("❌ Error parseando DATABASE_URL. Usando H2 de respaldo: " + e.getMessage());
                configureLocalH2(dataSource);
            }
        } else {
            configureLocalH2(dataSource);
        }
        
        return dataSource;
    }

    private void configureLocalH2(DriverManagerDataSource dataSource) {
        System.out.println("🔧 Configurando base de datos H2 en memoria local...");
        dataSource.setDriverClassName("org.h2.Driver");
        dataSource.setUrl("jdbc:h2:mem:iglesiadb;DB_CLOSE_DELAY=-1;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE");
        dataSource.setUsername("sa");
        dataSource.setPassword("");
    }
}

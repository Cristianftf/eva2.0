package com.backendeva.backend.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import java.time.Duration;

@Configuration
@EnableCaching
public class CacheConfig {

    /**
     * CacheManager optimizado con Caffeine para mejor rendimiento
     * Reemplaza ConcurrentMapCacheManager con una implementación más eficiente
     */
    @Bean
    @Primary
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();

        // Configuración avanzada de Caffeine
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .initialCapacity(100)
                .maximumSize(1000)
                .expireAfterWrite(Duration.ofMinutes(10))
                .weakKeys()
                .recordStats());

        // Nombres de caches optimizados
        cacheManager.setCacheNames(java.util.Arrays.asList(
            "users", "courses", "topics", "quizzes", "stats",
            "inscripciones", "mensajes", "notificaciones", "recursos",
            "cuestionariosCache", "cursosCache", "recursosCache",
            "usuariosCache", "contenidoCache"
        ));

        return cacheManager;
    }

    /**
     * Cache específico para datos de usuario (más persistente)
     */
    @Bean
    public CacheManager userCacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager("userDetails");
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .initialCapacity(50)
                .maximumSize(500)
                .expireAfterWrite(Duration.ofHours(1))
                .recordStats());
        return cacheManager;
    }

    /**
     * Cache para estadísticas (se actualiza frecuentemente)
     */
    @Bean
    public CacheManager statsCacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager("statistics");
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .initialCapacity(20)
                .maximumSize(100)
                .expireAfterWrite(Duration.ofMinutes(5))
                .recordStats());
        return cacheManager;
    }
    
    // Para usar Redis en el futuro, descomentar las siguientes líneas
    // y agregar la dependencia spring-data-redis en pom.xml
    
    /*
    @Bean
    public RedisCacheConfiguration cacheConfiguration() {
        return RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofHours(1))
                .disableCachingNullValues()
                .serializeValuesWith(
                    RedisSerializationContext.SerializationPair.fromSerializer(
                        new GenericJackson2JsonRedisSerializer()
                    )
                );
    }

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory redisConnectionFactory) {
        return RedisCacheManager.builder(redisConnectionFactory)
                .cacheDefaults(cacheConfiguration())
                .withCacheConfiguration("cuestionariosCache",
                    RedisCacheConfiguration.defaultCacheConfig().entryTtl(Duration.ofHours(2)))
                .withCacheConfiguration("cursosCache",
                    RedisCacheConfiguration.defaultCacheConfig().entryTtl(Duration.ofHours(4)))
                .withCacheConfiguration("recursosCache",
                    RedisCacheConfiguration.defaultCacheConfig().entryTtl(Duration.ofDays(1)))
                .build();
    }
    */
}
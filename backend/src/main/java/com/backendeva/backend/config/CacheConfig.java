package com.backendeva.backend.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfig {

    /**
     * Proporciona un CacheManager basado en ConcurrentHashMap
     * Esta es una implementación simple sin dependencias externas como Redis
     */
    @Bean
    public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager(
            "cuestionariosCache",
            "cursosCache",
            "recursosCache",
            "usuariosCache",
            "contenidoCache"
        );
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
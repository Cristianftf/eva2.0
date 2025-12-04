package com.backendeva.backend.controller;

import com.backendeva.backend.services.ConnectorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/connectors")
@CrossOrigin(origins = "*")
public class ConnectorController {

    @Autowired
    private ConnectorService connectorService;

    @PostMapping("/oai")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> harvestOAIPMH(@RequestBody OAIRequest request) {
        String result = connectorService.harvestOAIPMH(request.getEndpoint(), request.getSet(), request.getMetadataPrefix());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/z3950")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> searchZ3950(@RequestBody Z3950Request request) {
        Map<String, Object> result = connectorService.searchZ3950(
                request.getHost(),
                request.getPort(),
                request.getDatabase(),
                request.getQuery()
        );
        return ResponseEntity.ok(result);
    }

    @PostMapping("/federated-search")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESOR')")
    public ResponseEntity<Map<String, Object>> federatedSearch(@RequestBody FederatedSearchRequest request) {
        Map<String, Object> result = connectorService.federatedSearch(
                request.getQuery(),
                request.getRepositories()
        );
        return ResponseEntity.ok(result);
    }

    // DTOs
    public static class OAIRequest {
        private String endpoint;
        private String set;
        private String metadataPrefix;

        // Getters and setters
        public String getEndpoint() { return endpoint; }
        public void setEndpoint(String endpoint) { this.endpoint = endpoint; }

        public String getSet() { return set; }
        public void setSet(String set) { this.set = set; }

        public String getMetadataPrefix() { return metadataPrefix; }
        public void setMetadataPrefix(String metadataPrefix) { this.metadataPrefix = metadataPrefix; }
    }

    public static class Z3950Request {
        private String host;
        private int port;
        private String database;
        private String query;

        // Getters and setters
        public String getHost() { return host; }
        public void setHost(String host) { this.host = host; }

        public int getPort() { return port; }
        public void setPort(int port) { this.port = port; }

        public String getDatabase() { return database; }
        public void setDatabase(String database) { this.database = database; }

        public String getQuery() { return query; }
        public void setQuery(String query) { this.query = query; }
    }

    public static class FederatedSearchRequest {
        private String query;
        private String[] repositories;

        // Getters and setters
        public String getQuery() { return query; }
        public void setQuery(String query) { this.query = query; }

        public String[] getRepositories() { return repositories; }
        public void setRepositories(String[] repositories) { this.repositories = repositories; }
    }
}
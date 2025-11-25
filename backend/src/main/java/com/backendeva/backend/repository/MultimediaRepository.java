package com.backendeva.backend.repository;

import com.backendeva.backend.model.MultimediaItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MultimediaRepository extends JpaRepository<MultimediaItem, Long> {

    List<MultimediaItem> findByTemaId(Long temaId);
}
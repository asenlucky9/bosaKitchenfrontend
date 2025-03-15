package com.bosakitchen.backend.repository;

import com.bosakitchen.backend.model.SpecialOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SpecialOfferRepository extends JpaRepository<SpecialOffer, Long> {
    List<SpecialOffer> findByActiveTrue();
    List<SpecialOffer> findByActiveTrueAndStartDateBeforeAndEndDateAfter(LocalDateTime now, LocalDateTime now2);
} 
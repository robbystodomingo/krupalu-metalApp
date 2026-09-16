package com.krupalu.MetalApp.repo;

import com.krupalu.MetalApp.entity.VisitorCounter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface VisitorCounterRepository extends JpaRepository<VisitorCounter, Long> {

    @Modifying
    @Transactional
    @Query("UPDATE VisitorCounter v SET v.count = v.count + 1 WHERE v.id = 1")
    void incrementCount();
}
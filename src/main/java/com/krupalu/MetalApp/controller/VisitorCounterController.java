package com.krupalu.MetalApp.controller;

import com.krupalu.MetalApp.entity.VisitorCounter;
import com.krupalu.MetalApp.repo.VisitorCounterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/visitors")
@RequiredArgsConstructor
@CrossOrigin()
public class VisitorCounterController {

    private final VisitorCounterRepository visitorCounterRepository;

    @PostMapping("/increment")
    @Transactional
    public Map<String, Long> incrementAndGetCount() {
        // Seed the single row if it doesn't exist yet
        if (!visitorCounterRepository.existsById(1L)) {
            visitorCounterRepository.save(VisitorCounter.builder().id(1L).count(0L).build());
        }

        visitorCounterRepository.incrementCount();
        Long current = visitorCounterRepository.findById(1L)
                .map(VisitorCounter::getCount)
                .orElse(0L);

        return Map.of("count", current);
    }
}
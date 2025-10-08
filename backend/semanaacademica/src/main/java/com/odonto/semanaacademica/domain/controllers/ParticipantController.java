package com.odonto.semanaacademica.domain.controllers;

import com.odonto.semanaacademica.domain.dto.ParticipantDTO;
import com.odonto.semanaacademica.domain.entities.AttendanceSession;
import com.odonto.semanaacademica.domain.entities.Participant;
import com.odonto.semanaacademica.domain.services.ParticipantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/participants")
public class ParticipantController {

    @Autowired
    ParticipantService participantService;

    @GetMapping
    public ResponseEntity<List<ParticipantDTO>> getParticipants() {
        return ResponseEntity.ok(participantService.findAll());
    }


    @GetMapping("/search")
    public ResponseEntity<List<ParticipantDTO>> search(@RequestParam String q) {
        return ResponseEntity.ok(participantService.search(q));
    }

    @GetMapping("/by-barcode/{barcode}")
    public ResponseEntity<ParticipantDTO> getByBarcodeAlias(@PathVariable String barcode) {
        return ResponseEntity.ok(participantService.getDetailedByBarcode(barcode));
    }

    @GetMapping("/barcode/{barcode}")
    public ResponseEntity<ParticipantDTO> getByBarcode(@PathVariable String barcode) {
        return ResponseEntity.ok(participantService.getDetailedByBarcode(barcode));
    }



}

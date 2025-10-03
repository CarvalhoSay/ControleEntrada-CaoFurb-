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
@RequestMapping("/participant")
public class ParticipantController {

    @Autowired
    ParticipantService participantService;

    @Autowired
    AttendanceSession attendanceSession;

    @GetMapping("/find")
    public ResponseEntity<List<ParticipantDTO>> getParticipants(){
        List<ParticipantDTO> list = participantService.findAll();
        return ResponseEntity.ok().body(list);
    }

    @GetMapping("/barcode/{barcode}")
    public ResponseEntity<ParticipantDTO> getByBarcode(@PathVariable String barcode) {
        ParticipantDTO dto = participantService.getByBarcodeOrThrow(barcode);
        return ResponseEntity.ok(dto);
    }




}

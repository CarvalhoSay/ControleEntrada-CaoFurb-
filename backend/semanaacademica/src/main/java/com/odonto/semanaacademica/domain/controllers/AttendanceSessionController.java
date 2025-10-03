package com.odonto.semanaacademica.domain.controllers;

import com.odonto.semanaacademica.domain.dto.AttendanceSessionDTO;
import com.odonto.semanaacademica.domain.dto.ScanDTO;
import com.odonto.semanaacademica.domain.services.AttendanceSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("attendance")
public class AttendanceSessionController {

    private final AttendanceSessionService attendanceSessionService;


    public AttendanceSessionController(AttendanceSessionService attendanceSessionService) {
        this.attendanceSessionService = attendanceSessionService;
    }

    // 1) Registrar ENTRADA
    @PostMapping("/entry")
    public ResponseEntity<AttendanceSessionDTO> registerEntry(@RequestBody ScanDTO body) {
        AttendanceSessionDTO dto = attendanceSessionService.registerEntry(body.barcode());
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @PostMapping("/exit")
    public ResponseEntity<AttendanceSessionDTO> registerExit(@RequestBody ScanDTO body){
        AttendanceSessionDTO dto = attendanceSessionService.exitSession(body.barcode());
        return ResponseEntity.ok(dto);
    }


}

package com.odonto.semanaacademica.domain.services;

import com.odonto.semanaacademica.domain.dto.AttendanceSessionDTO;
import com.odonto.semanaacademica.domain.dto.ParticipantDTO;
import com.odonto.semanaacademica.domain.entities.AttendanceSession;
import com.odonto.semanaacademica.domain.entities.Participant;
import com.odonto.semanaacademica.domain.repositories.AttendanceSessionRepository;
import com.odonto.semanaacademica.domain.repositories.ParticipantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AttendanceSessionService {

    @Autowired
    private AttendanceSessionRepository attendanceSessionRepository;

    @Autowired
    ParticipantRepository participantRepository;

    @Autowired
    private ParticipantService participantService;

    public AttendanceSessionDTO registerEntry(String barcode){

        ParticipantDTO dto = participantService.getByBarcodeOrThrow(barcode);



        return null;
    }

}

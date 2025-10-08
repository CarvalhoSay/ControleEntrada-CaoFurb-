package com.odonto.semanaacademica.domain.services;

import com.odonto.semanaacademica.domain.dto.ParticipantDTO;
import com.odonto.semanaacademica.domain.entities.Participant;
import com.odonto.semanaacademica.domain.repositories.AttendanceSessionRepository;
import com.odonto.semanaacademica.domain.repositories.ParticipantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.odonto.semanaacademica.domain.entities.AttendanceSession;
import java.time.LocalDateTime;


import java.util.ArrayList;
import java.util.List;


@Service
public class ParticipantService {

    @Autowired
    private ParticipantRepository participantRepository;

    @Autowired
    private AttendanceSessionRepository attendanceSessionRepository;

    @Transactional
    public List<ParticipantDTO> findAll(){
        List<Participant> participants = participantRepository.findAll();

        List<ParticipantDTO> dtos = new ArrayList<>();

        for(Participant p : participants){
            dtos.add(new ParticipantDTO(p));
        }

        return dtos;
    }

    public ParticipantDTO getByBarcodeOrThrow(String barcode){

        if(barcode == null || barcode.trim().isEmpty()){
            throw new IllegalArgumentException("Codigo de Barras nao pode ser vazio");
        }

        Participant entity = participantRepository.findByBarcode(barcode.trim())
                .orElseThrow(() -> new RuntimeException("Participante não encontrado para o barcode: " + barcode));


        return new ParticipantDTO(entity);
    }

    public List<ParticipantDTO> search(String term) {
        if (term == null || term.isBlank()) return findAll();
        return participantRepository
                .findByNameContainingIgnoreCaseOrBarcodeContainingIgnoreCase(term.trim(), term.trim())
                .stream().map(ParticipantDTO::new).toList();
    }

    @Transactional(readOnly = true)
    public ParticipantDTO getDetailedByBarcode(String barcode) {
        Participant entity = participantRepository.findByBarcode(barcode)
                .orElseThrow(() -> new IllegalArgumentException("Participante não encontrado"));

        boolean hasOpen = attendanceSessionRepository
                .findFirstByParticipantAndEndTimeIsNull(entity).isPresent();

        LocalDateTime lastEntryAt = attendanceSessionRepository
                .findTopByParticipantOrderByStartTimeDesc(entity)
                .map(AttendanceSession::getStartTime)
                .orElse(null);

        return new ParticipantDTO(entity.getId(), entity.getName(), entity.getBarcode(), hasOpen, lastEntryAt);
    }

}

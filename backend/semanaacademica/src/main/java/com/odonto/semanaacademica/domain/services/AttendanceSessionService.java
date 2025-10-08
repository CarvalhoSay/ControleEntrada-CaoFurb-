package com.odonto.semanaacademica.domain.services;

import com.odonto.semanaacademica.domain.dto.AttendanceSessionDTO;
import com.odonto.semanaacademica.domain.dto.ParticipantDTO;
import com.odonto.semanaacademica.domain.entities.AttendanceSession;
import com.odonto.semanaacademica.domain.entities.Participant;
import com.odonto.semanaacademica.domain.repositories.AttendanceSessionRepository;
import com.odonto.semanaacademica.domain.repositories.ParticipantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityNotFoundException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AttendanceSessionService {

    @Autowired
    private AttendanceSessionRepository attendanceSessionRepository;

    @Autowired
    ParticipantRepository participantRepository;

    @Autowired
    private ParticipantService participantService;



    @Transactional
    public AttendanceSessionDTO registerEntry(String barcode) {

        if (barcode == null || barcode.trim().isEmpty()) {
            throw new IllegalArgumentException("Código de barras não pode ser vazio.");
        }


        // 1) Validação + obtenção do DTO (já normaliza/valida internamente)
        ParticipantDTO dto = participantService.getByBarcodeOrThrow(barcode);

        // 2) Buscar ENTIDADE pelo barcode do DTO
        Participant participant = participantRepository.findByBarcode(dto.getBarcode())
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException(
                        "Participante não encontrado para o código de barras: " + dto.getBarcode()));

        // 3) Verificar se já existe sessão aberta (endTime == null)
        Optional<AttendanceSession> openOpt =
                attendanceSessionRepository.findFirstByParticipantAndEndTimeIsNull(participant);
        if (openOpt.isPresent()) {
            throw new IllegalStateException("Já existe uma sessão de presença em aberto para este participante.");
        }

        // 4) Criar nova sessão
        AttendanceSession session = new AttendanceSession();
        session.setParticipant(participant);
        session.setStartTime(LocalDateTime.now());
        session.setEndTime(null);

        // 5) Persistir
        AttendanceSession saved = attendanceSessionRepository.save(session);

        // 6) Montar DTO “na mão” e retornar
        return new AttendanceSessionDTO(
                saved.getParticipant().getName(),
                saved.getParticipant().getBarcode(),
                saved.getStartTime(),
                saved.getEndTime()
        );

    }


    @Transactional
    public AttendanceSessionDTO exitSession(String barcode){
        if (barcode == null || barcode.trim().isEmpty()) {
            throw new IllegalArgumentException("Código de barras não pode ser vazio.");
        }


        //valida se o codigo de barras passado é valido.
        ParticipantDTO dto = participantService.getByBarcodeOrThrow(barcode);

        //Buscar entidade pelo codigo de barras do DTO.
        Participant participant = participantRepository.findByBarcode(dto.getBarcode())
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException(
                        "Participante não encontrado para o código de barras: " + dto.getBarcode()));


        // buscar session aberta para poder fechar.
        AttendanceSession open = attendanceSessionRepository.findFirstByParticipantAndEndTimeIsNull(participant)
                .orElseThrow(() -> new IllegalArgumentException("Não há sessão em aberta para este participante."));

        // fechando a sessao
        open.setEndTime(LocalDateTime.now());
        AttendanceSession saved = attendanceSessionRepository.save(open);

        // retornando DTO
        return new AttendanceSessionDTO(
                saved.getParticipant().getName(),
                saved.getParticipant().getBarcode(),
                saved.getStartTime(),
                saved.getEndTime()
        );
    }

    @Transactional(readOnly = true)
    public List<AttendanceSessionDTO> listSessions(String barcode) {
        ParticipantDTO dto = participantService.getByBarcodeOrThrow(barcode);

        Participant participant = participantRepository.findByBarcode(dto.getBarcode())
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException(
                        "Participante não encontrado para o código de barras: " + dto.getBarcode()));

        List<AttendanceSession> sessions = attendanceSessionRepository.findByParticipant(participant);

        return sessions.stream()
                .map(s -> new AttendanceSessionDTO(
                        s.getParticipant().getName(),
                        s.getParticipant().getBarcode(),
                        s.getStartTime(),
                        s.getEndTime()
                ))
                .toList();
    }

    public List<AttendanceSessionDTO> findByParticipantBarcode(String barcode) {
        return attendanceSessionRepository.findByParticipantBarcode(barcode)
                .stream()
                .map(AttendanceSessionDTO::fromEntity)
                .toList();
    }
}

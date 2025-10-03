package com.odonto.semanaacademica.domain.repositories;

import com.odonto.semanaacademica.domain.entities.AttendanceSession;
import com.odonto.semanaacademica.domain.entities.Participant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AttendanceSessionRepository extends JpaRepository<AttendanceSession, Long> {

Optional<AttendanceSession> findByParticipantAndEndTimeIsNull (Participant participant);

List<AttendanceSession> findByParticipant(Participant participant);

}

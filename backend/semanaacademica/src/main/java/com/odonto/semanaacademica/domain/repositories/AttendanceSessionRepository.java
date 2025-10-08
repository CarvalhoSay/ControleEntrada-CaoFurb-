package com.odonto.semanaacademica.domain.repositories;

import com.odonto.semanaacademica.domain.entities.AttendanceSession;
import com.odonto.semanaacademica.domain.entities.Participant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AttendanceSessionRepository extends JpaRepository<AttendanceSession, Long> {

Optional<AttendanceSession> findByParticipantAndEndTimeIsNull (Participant participant);

List<AttendanceSession> findByParticipant(Participant participant);

    Optional<AttendanceSession> findFirstByParticipantAndEndTimeIsNull(Participant participant);

    Optional<AttendanceSession> findTopByParticipantOrderByStartTimeDesc(Participant participant);
    boolean existsByParticipantAndEndTimeIsNull(Participant participant);

    @Query("""
      select s from AttendanceSession s
      join fetch s.participant p
      where p.barcode = :barcode
      order by s.startTime asc
    """)
    List<AttendanceSession> findByParticipantBarcode(@Param("barcode") String barcode);
}


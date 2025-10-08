package com.odonto.semanaacademica.domain.repositories;

import com.odonto.semanaacademica.domain.entities.AttendanceSession;
import com.odonto.semanaacademica.domain.entities.Participant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ParticipantRepository extends JpaRepository<Participant, Long> {

    Optional<Participant> findByBarcode(String barcode);

    List<Participant> findByNameContainingIgnoreCaseOrBarcodeContainingIgnoreCase(String name, String barcode);
}

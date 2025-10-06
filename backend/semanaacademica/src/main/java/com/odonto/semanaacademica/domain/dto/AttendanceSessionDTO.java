package com.odonto.semanaacademica.domain.dto;

import com.odonto.semanaacademica.domain.entities.AttendanceSession;

import java.io.Serializable;
import java.time.LocalDateTime;

public class AttendanceSessionDTO {


    private String participantName;
    private String barcode;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    public AttendanceSessionDTO(){}

    public AttendanceSessionDTO(String participantName, String barcode, LocalDateTime startTime, LocalDateTime endTime) {
        this.participantName = participantName;
        this.barcode = barcode;
        this.startTime = startTime;
        this.endTime = endTime;
    }


    public AttendanceSessionDTO(AttendanceSession entity) {
        participantName = entity.getParticipant().getName();
        barcode = entity.getParticipant().getBarcode();
        startTime = entity.getStartTime();
        endTime = entity.getEndTime();
    }

    public String getParticipantName() {
        return participantName;
    }

    public void setParticipantName(String participantName) {
        this.participantName = participantName;
    }

    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }
}

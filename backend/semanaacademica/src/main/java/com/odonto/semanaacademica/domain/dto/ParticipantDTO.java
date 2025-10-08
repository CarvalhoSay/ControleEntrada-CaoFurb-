// com/odonto/semanaacademica/domain/dto/ParticipantDTO.java
package com.odonto.semanaacademica.domain.dto;

import com.odonto.semanaacademica.domain.entities.Participant;

import java.io.Serializable;
import java.time.LocalDateTime;

public class ParticipantDTO implements Serializable {

    private Long id;
    private String name;
    private String barcode;
    private Boolean hasOpenSession;
    private LocalDateTime lastEntryAt;

    public ParticipantDTO(){}

    public ParticipantDTO(Long id, String name, String barcode, Boolean hasOpenSession, LocalDateTime lastEntryAt) {
        this.id = id;
        this.name = name;
        this.barcode = barcode;
        this.hasOpenSession = hasOpenSession;
        this.lastEntryAt = lastEntryAt;
    }

    // construtor básico (compatível com o que você já usa)
    public ParticipantDTO(Participant entity) {
        this.id = entity.getId();
        this.name = entity.getName();
        this.barcode = entity.getBarcode();
    }

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBarcode() { return barcode; }
    public void setBarcode(String barcode) { this.barcode = barcode; }

    public Boolean getHasOpenSession() { return hasOpenSession; }
    public void setHasOpenSession(Boolean hasOpenSession) { this.hasOpenSession = hasOpenSession; }

    public LocalDateTime getLastEntryAt() { return lastEntryAt; }
    public void setLastEntryAt(LocalDateTime lastEntryAt) { this.lastEntryAt = lastEntryAt; }
}

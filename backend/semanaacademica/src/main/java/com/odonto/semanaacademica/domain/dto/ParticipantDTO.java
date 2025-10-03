package com.odonto.semanaacademica.domain.dto;

import com.odonto.semanaacademica.domain.entities.Participant;

import java.io.Serializable;

public class ParticipantDTO implements Serializable {

    private String name;
    private String barcode;

    public ParticipantDTO(){

    }

    public ParticipantDTO(String name, String barcode) {
        this.name = name;
        this.barcode = barcode;
    }

    public ParticipantDTO(Participant entity) {
        name = entity.getName();
        barcode = entity.getBarcode();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }
}

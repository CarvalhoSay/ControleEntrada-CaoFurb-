package com.odonto.semanaacademica.domain.services;

import com.odonto.semanaacademica.domain.dto.ParticipantDTO;
import com.odonto.semanaacademica.domain.entities.Participant;
import com.odonto.semanaacademica.domain.repositories.ParticipantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@Service
public class ParticipantService {

    @Autowired
    private ParticipantRepository participantRepository;

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


}

package com.example.gestionprojeet.classes;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Tableau {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  long idTableau ;
    private  String nom ;
    private  String  description ;
    @ManyToOne
    private Utlisateur proprietaire;
    @OneToMany(mappedBy = "tableau")
    private List<Projet> projets;

}

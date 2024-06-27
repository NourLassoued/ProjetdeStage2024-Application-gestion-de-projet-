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
public class Projet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
     private Long idProjet   ;
    private String nom     ;
    private  String description;
    @ManyToOne
    private Tableau tableau;
    @OneToMany(mappedBy = "projet")
    private List<Carte> cartes;
    @ManyToMany(mappedBy = "projets")
    private List<Utlisateur> utilisateurs;


}

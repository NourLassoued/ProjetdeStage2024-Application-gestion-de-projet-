package com.example.gestionprojeet.classes;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Carte {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idCarte;

    private String titre;
    private String description;
    private Date dateCreation;
    private Date dateEcheance;
    @ManyToOne

    private Projet projet;
    @OneToMany(mappedBy = "carte")
    private List<Commentaire> commentaires;
}

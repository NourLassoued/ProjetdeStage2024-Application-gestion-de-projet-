package com.example.gestionprojeet.Respository;

import com.example.gestionprojeet.classes.Carte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarteRepo extends JpaRepository<Carte,Long> {
}

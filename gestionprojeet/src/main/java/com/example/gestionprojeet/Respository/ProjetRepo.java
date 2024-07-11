package com.example.gestionprojeet.Respository;

import com.example.gestionprojeet.classes.Projet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjetRepo extends JpaRepository<Projet,Long> {
}

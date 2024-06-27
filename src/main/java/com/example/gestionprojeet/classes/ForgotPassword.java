package com.example.gestionprojeet.classes;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
public class ForgotPassword {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer fpid;
    private Integer otp;
    private Date expirationTime;
    @OneToOne
    private Utlisateur user;
}

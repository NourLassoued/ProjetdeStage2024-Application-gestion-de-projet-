import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role } from 'src/models/Role';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import {MatSnackBar} from "@angular/material/snack-bar";
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  selectedRole: Role = Role.ADMINISTRATEUR; // Initialisez la propriété avec une valeur par défaut si nécessaire

  registerForm!: FormGroup;


  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router, private snackbar: MatSnackBar) {
  
    this.registerForm = this.fb.group({
      firstname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern("^.*@gmail.com$")]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    
      agreedToTerms: [false, Validators.requiredTrue]
    });
  }
  register() {
    this.authService.register(this.registerForm.value).subscribe(
      (response: any) => {
        this.registerForm.reset();
        console.log("response : ", response);
        this.snackbar.open('User added successfully!', 'Close', {
          duration: 9000,
        }).afterDismissed().subscribe(() => {
          this.router.navigate(['/login']);
        });
      },
      error => {
        console.error('error.error : ', error.error, 'error.status : ', error.status);
        // Optionnel : Afficher une notification Snackbar pour les erreurs
        this.snackbar.open('Error while registering user. Please try again.', 'Close', {
          duration: 5000,
        });
      }
    );
  }

}
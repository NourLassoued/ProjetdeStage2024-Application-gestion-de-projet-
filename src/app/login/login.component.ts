import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public loginForm!: FormGroup;
  showLoginForm = true; // Affiche le formulaire de connexion par défaut
  email: string = '';
  password: string = '';
  showResetForm = false; 
  toggleForm() {
    this.showLoginForm = !this.showLoginForm; // Inverse l'état du formulaire
  }
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  })
  }authenticate(): void {
    this.authService.authenticate(this.email, this.password).subscribe(
      response => {
        // Authentification réussie
        console.log('Authentication successful', response);

        // Stockage dans localStorage
        localStorage.setItem('email', this.email);
        localStorage.setItem('password', this.password);

        // Redirection vers une autre page (par exemple la page d'accueil)
        this.router.navigate(['/home']);
      },
      error => {
        // Gérer les erreurs d'authentification ici
        console.error('Authentication error', error);
        // Vous pouvez également afficher un message d'erreur à l'utilisateur
      }
    );
  }

  refreshToken(refreshToken: string): void {
    this.authService.refreshToken(refreshToken).subscribe(
      response => {
        // Traitez la réponse du rafraîchissement de token ici
        console.log('Token refreshed', response);
      },
      error => {
        // Gérer les erreurs de rafraîchissement de token ici
        console.error('Refresh token error', error);
      }
    );
  }
}
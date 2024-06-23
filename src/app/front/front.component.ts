import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.css']
})
export class FrontComponent implements OnDestroy {
  status = false;
addToggle()
{
  this.status = !this.status;       
}
constructor(private authService: AuthService, private router: Router) { }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
logout(): void {
  this.authService.logout(); 
  localStorage.removeItem('email'); // Supprimer l'email stocké
        localStorage.removeItem('password'); // Supprimer le mot de passe (ceci est à des fins d'exemple seulement, ce n'est pas recommandé en pratique)

        
  this.router.navigate(['/login']);// Appel de la méthode logout() du service AuthService
}

}

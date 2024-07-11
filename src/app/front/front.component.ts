import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from 'src/models/Role';
import { IsAdminService } from '../shared/is-admin.service';
import { FileService } from '../file.service';
import { UserService } from '../user.service';
import { Utilisateur } from 'src/models/Utilisateur';
import { Tableau } from 'src/models/Tableau';
import { TableauxService } from '../tableaux.service';

@Component({
  selector: 'app-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.css']
})
export class FrontComponent implements  OnInit  {
  status = false;
  profileImage: string | undefined;
  users: Utilisateur[] = [];
  tableaux: Tableau[] = [];
 isAdmin: boolean = false;
 email: string = ''; // Définissez la propriété email
 password: string = ''; 
  user: Utilisateur | undefined; 
  currentUser: Utilisateur | null = null; 
  displayTableForm: boolean = false;
  userForm: Utilisateur = {} as Utilisateur; // Utilisation de Partial pour autoriser les champs optionnels
  showUpdateForm: boolean = false;
  tableForm: Tableau = { nom: '', description: '', proprietaire: null, projets: [] }; // Utilisation de Tableau avec toutes les propriétés
addToggle()
{
  this.status = !this.status;       
}
constructor(private authService: AuthService, private router: Router,private route: ActivatedRoute,private isAdminService:IsAdminService,private fileService: FileService,private userService: UserService,private tableauService :TableauxService) {
  
 }

  ngOnInit(): void {
   
     this.checkUserRole();
     this.loadUserData();
    

  }loadUserData(): void {
    const currentUserString = localStorage.getItem('currentUser');
    if (currentUserString) {
      try {
        this.currentUser = JSON.parse(currentUserString);
        if (this.currentUser && this.currentUser.image) {
          this.profileImage = this.getImageUrl(this.currentUser.image);
        }
        // Pré-remplir le formulaire avec les informations actuelles de l'utilisateur
        if (this.currentUser) {
          this.userForm.firstname = this.currentUser.firstname || '';
          this.userForm.email = this.currentUser.email || '';
          // Ajoutez d'autres champs si nécessaire
        }
      } catch (error) {
        console.error('Erreur lors de la lecture des données de l\'utilisateur depuis le localStorage :', error);
      }
    } else {
      console.error('Aucun utilisateur connecté trouvé dans le localStorage.');
    }
  }
  
  
  
  toggleUpdateForm(): void {
    this.showUpdateForm = !this.showUpdateForm;
  }

    private checkUserRole(): void {
      this.isAdminService.getIsAdmin().subscribe(isAdmin => {
        this.isAdmin = isAdmin;
        console.log('isAdmin in front component:', this.isAdmin);
        
      });
      const currentUserString = localStorage.getItem('currentUser');
      if (currentUserString) {
        const currentUser = JSON.parse(currentUserString);
  
        // Utilisez les informations de l'utilisateur
        if (currentUser && currentUser.image) {
          this.profileImage = this.getImageUrl(currentUser.image);
        }
      } else {
        console.error('Aucun utilisateur connecté trouvé dans le localStorage.');
        // Gérer le cas où aucune information d'utilisateur n'est trouvée
      }
    }
    getImageUrl(filename: string): string {
      return `http://localhost:8087/nour/api/v1/auth/get-image/${filename}`;
    }
logout(): void {
  this.authService.logout(); 
  
        localStorage.removeItem('access_token');
        
  this.router.navigate(['/login']);
} onSubmit(): void {
  if (this.currentUser && this.currentUser.id) {
    const userId = this.currentUser.id;
    this.userService.updateUser(userId,this.userForm as Utilisateur).subscribe(
      (updatedUser) => {
        console.log('Utilisateur mis à jour avec succès :', updatedUser);
        // Mettez à jour les données de l'utilisateur dans votre composant si nécessaire
        if (updatedUser) {
          this.currentUser = updatedUser;
          // Mettez à jour le formulaire avec les nouvelles données
          this.userForm.firstname = updatedUser.firstname || '';
          this.userForm.email = updatedUser.email || '';
          // Ajoutez d'autres champs si nécessaire

          // Mettre à jour les données de l'utilisateur dans localStorage
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }
        // Implémentez la logique de gestion de la réponse ici (par exemple, affichez un message de succès)
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
        // Gérez les erreurs ici (par exemple, affichez un message d'erreur à l'utilisateur)
      }
    );
  } else {
    console.error('ID utilisateur non défini.');
    // Gérer le cas où currentUser ou currentUser.id n'est pas défini
  }
}
showTableForm(): void {
  this.displayTableForm = true;
}
onSubmitTableau(): void {
  if (this.currentUser && this.currentUser.id) {
    this.tableauService.createTableau(this.currentUser.id, this.tableForm).subscribe(
      (newTableau: Tableau) => {
        console.log('Nouveau tableau créé avec succès :', newTableau);
        this.tableForm = { nom: '', description: '', proprietaire: null, projets: [] };
        this.displayTableForm = false;
      },
      (error: any) => {
        console.error('Erreur lors de la création du tableau :', error);
        // Gérer les erreurs ici
      }
    );
  } else {
    console.error('ID utilisateur non défini.');
    // Gérer le cas où currentUser ou currentUser.id n'est pas défini
  }
}
toggleTableForm(): void {
  this.displayTableForm = !this.displayTableForm;
}
}
import { Component } from '@angular/core';
import { ProjetService } from '../projet.service';
import { Utilisateur } from 'src/models/Utilisateur';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IsAdminService } from '../shared/is-admin.service';
import { FileService } from '../file.service';
import { UserService } from '../user.service';
import { TableauxService } from '../tableaux.service';
import { Tableau } from 'src/models/Tableau';
import { Carte } from 'src/models/Carte';
import { Projet } from 'src/models/Projet';

@Component({
  selector: 'app-carteuser',
  templateUrl: './carteuser.component.html',
  styleUrls: ['./carteuser.component.css']
})
export class CarteuserComponent {
  constructor(private authService: AuthService, private router: Router,private route: ActivatedRoute,private isAdminService:IsAdminService,private fileService: FileService,private userService: UserService,private tableauService :TableauxService,private projetService :ProjetService) { }
  status = false;
  userForm: Utilisateur = {} as Utilisateur;
  showUpdateForm: boolean = false;
  currentUser: Utilisateur | null = null;
  profileImage: string | undefined;
  isAdmin: boolean = false;
  projet: Projet | null = null;
  tableForm: Tableau = { nom: '', description: '', proprietaire: null, projets: [] };
  displayTableForm: boolean = false;
  cartesDuProjet: Carte[] = [];
  projetsUtilisateur: Projet[] = [];
  projetSelectionne: Projet | null = null;

  
  nouvelleCarte: Carte = {
    titre: '',
    description: '',
  
    projet: null,
    commentaires:[]
  }
  ngOnInit(): void {

    this.checkUserRole();
    this.loadUserData();
    this.loadProjetsUtilisateur();

  
  }
  
  loadUserData(): void {
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
  
  
  
  
  
  onSubmit(): void {
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
  toggleUpdateForm(): void {
    this.showUpdateForm = !this.showUpdateForm;
  }
  logout(): void {
    this.authService.logout(); 
    
          localStorage.removeItem('access_token');
          
    this.router.navigate(['/login']);
  }
  addToggle()
{
  this.status = !this.status;       
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
}loadProjetsUtilisateur(): void {
  if (this.currentUser && this.currentUser.id) {
    this.projetService.getProjetsUtilisateur(this.currentUser.id).subscribe(
      (projets: any[]) => {
        this.projetsUtilisateur = projets;
        console.log('Projets de l\'utilisateur :', this.projetsUtilisateur);
      },
      (error) => {
        console.error('Erreur lors de la récupération des projets de l\'utilisateur :', error);
        // Handle the error in your component as needed
      }
    );
  } else {
    console.error('ID utilisateur non défini.');
  }
}ajouterCarteAProjet(): void {
  if (this.projetSelectionne && this.projetSelectionne.idProjet) {
    // Ensure both this.projetSelectionne and this.projetSelectionne.idProjet are defined
    this.projetService.ajouterCarteAProjet(this.projetSelectionne.idProjet, this.nouvelleCarte).subscribe(
      () => {
        console.log('Carte ajoutée avec succès au projet.');
        this.projetSelectionne = null; // Reset the selected project if needed
        // Reset the new card object after successful addition
      },
      error => {
        console.error('Erreur lors de l\'ajout de la carte au projet :', error);
        // Handle error as needed
      }
    );
  } else {
    console.error('Aucun projet sélectionné ou ID de projet non défini pour ajouter une carte.');
  }
}


selectionnerProjet(projet: Projet): void {
  this.projetSelectionne = projet;
  if (this.projetSelectionne?.idProjet) {
    this.loadCartesDuProjet(this.projetSelectionne.idProjet); // Utilisation sécurisée de l'opérateur ?.
  }
}

// Ajoutez d'autres méthodes nécessaires ici en fonction de votre application
loadCartesDuProjet(idProjet: number): void {
  if (idProjet) {
    this.projetService.getCartesDuProjet(idProjet).subscribe(
      (cartes: Carte[]) => {
        this.cartesDuProjet = cartes;
        console.log('Cartes du projet sélectionné :', this.cartesDuProjet);
      },
      (error) => {
        console.error('Erreur lors de la récupération des cartes du projet :', error);
      }
    );
  } else {
    console.error('ID de projet non défini.');
  }
}
}

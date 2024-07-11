import { Component } from '@angular/core';
import { Tableau } from 'src/models/Tableau';
import { Utilisateur } from 'src/models/Utilisateur';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IsAdminService } from '../shared/is-admin.service';
import { FileService } from '../file.service';
import { UserService } from '../user.service';
import { TableauxService } from '../tableaux.service';
import { ProjetService } from '../projet.service';
import { Projet } from 'src/models/Projet';

@Component({
  selector: 'app-tableuseer',
  templateUrl: './tableuseer.component.html',
  styleUrls: ['./tableuseer.component.css']
})
export class TableuseerComponent {
  status = false;
  profileImage: string | undefined;
  users: Utilisateur[] = [];
  tableaux: Tableau[] = [];
  tableau: Tableau | null = null;
 isAdmin: boolean = false;
 email: string = ''; // Définissez la propriété email
 password: string = ''; 
  user: Utilisateur | undefined; 
  currentUser: Utilisateur | null = null; 
  displayTableForm: boolean = false;
  userForm: Utilisateur = {} as Utilisateur; // Utilisation de Partial pour autoriser les champs optionnels
  showUpdateForm: boolean = false;
  showForm: boolean = false;
  projects: any[] = []; 
  newProject: Projet = new Projet();
 formVisible: boolean = true; // Déclaration de formVisible ici

  selectedTableauId: number | null = null;  
  tableForm: Tableau = { nom: '', description: '', proprietaire: null, projets: [] }; // Utilisation de Tableau avec toutes les propriétés
addToggle()
{
  this.status = !this.status;       
}
constructor(private authService: AuthService, private router: Router,private route: ActivatedRoute,private isAdminService:IsAdminService,private fileService: FileService,private userService: UserService,private tableauService :TableauxService,private projetService :ProjetService) {
  
 }

  ngOnInit(): void {
   
     this.checkUserRole();
     this.loadUserData();
    this.fetchUserTableaux();
    this.newProject = new Projet();
    this.getAllProjects();

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
fetchUserTableaux(): void {
  if (this.currentUser && this.currentUser.id) {
    this.tableauService.getTableauxByUtilisateur(this.currentUser.id)
      .subscribe(
        (tableaux: Tableau[]) => {
          this.tableaux = tableaux;
          console.log('Tableaux de l\'utilisateur récupérés :', this.tableaux);
        },
        (error) => {
          console.error('Erreur lors de la récupération des tableaux de l\'utilisateur :', error);
          // Gérer les erreurs ici
        }
      );
  } else {
    console.error('ID utilisateur non défini.');
    // Gérer le cas où currentUser ou currentUser.id n'est pas défini
  }
}  showProjectForm(tableau: Tableau): void {
  if (tableau && tableau.idTableau !== undefined) {
    if (this.selectedTableauId === tableau.idTableau) {
      // Si le même tableau est cliqué à nouveau, masquer le formulaire
      this.selectedTableauId = null;
      this.showForm = false;
    } else {
      // Afficher le formulaire pour le tableau cliqué
      this.selectedTableauId = tableau.idTableau;
      this.showForm = true;
    }
  } else {
    console.error('tableau or tableau.idTableau is null or undefined');
    // Gérer le cas où tableau ou son idTableau est null ou indéfini
  }
}

onSubmitProject(): void {

  if (this.selectedTableauId !== null) {
    // Trouver le tableau sélectionné dans votre liste de tableaux
    const selectedTableau = this.tableaux.find(tableau => tableau.idTableau === this.selectedTableauId);

    if (selectedTableau) {
      // Assigner le tableau au projet
      this.newProject.tableau = selectedTableau;

      // Appeler le service pour créer le projet
      this.projetService.createProject(this.selectedTableauId, this.newProject).subscribe(
        (createdProject) => {
          console.log('Projet créé avec succès : ', createdProject);

          // Réinitialiser le formulaire et masquer le formulaire après soumission
          this.newProject = new Projet();
          this.showForm = false;
          this.selectedTableauId = null; // Réinitialiser l'id du tableau sélectionné
        },
        (error) => {
          console.error('Erreur lors de la création du projet : ', error);
          // Gérer l'erreur selon les besoins de votre application
        }
      );
    } else {
      console.error('Tableau with id ' + this.selectedTableauId + ' not found.');
      // Gérer le cas où le tableau sélectionné n'est pas trouvé
    }
  } else {
    console.error('selectedTableauId is null or undefined');
    // Gérer le cas où l'id du tableau sélectionné est null ou indéfini
  }
 
 
}
getAllProjects(): void {
  this.projetService.getAllProjects()
    .subscribe(
      data => {
        this.projects = data; // Affecte les projets récupérés à la variable projects
      },
      error => {
        console.error('Error fetching projects', error);
        // Vous pouvez ajouter ici un traitement pour afficher un message d'erreur à l'utilisateur
      }
    );
   
}

}


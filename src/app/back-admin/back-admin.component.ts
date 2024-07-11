import { Component, Input } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { Utilisateur } from 'src/models/Utilisateur';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Role } from 'src/models/Role';
import { IsAdminService } from '../shared/is-admin.service';
import { TableauxService } from '../tableaux.service';
import { Tableau } from 'src/models/Tableau';

@Component({
  selector: 'app-back-admin',
  templateUrl: './back-admin.component.html',
  styleUrls: ['./back-admin.component.css']
})
export class BackAdminComponent {
  @Input('appHidePassword') password: string = '';
  displayedColumns: string[] = ['image', 'firstname', 'email','role','actions'];
  status = false;
  user: Utilisateur | undefined; 
  displayTableForm: boolean = false;
  userForm: Utilisateur = {} as Utilisateur
  tableForm: Tableau = { nom: '', description: '', proprietaire: null, projets: [] }; // Utilisation de Tableau avec toutes les propriétés
  currentUser: Utilisateur | null = null; 
  id!: number;// Remplacer par l'ID de l'utilisateur que vous souhaitez mettre à jour
  newRole!: string; 
  profileImage: string | undefined;
  users: Utilisateur[] = [];
  isAdmin: boolean = false;
  showUpdateForm: boolean = false;
  roles: Role[] = [Role.ADMINISTRATEUR, Role.MEMBRE, Role.OBSERVATEUR]; 

  addToggle()
{
  this.status = !this.status;       
}
ngOnInit(): void {
  this.getAllUsers();
  this.loadUserData();
  this.checkUserRole();
}
constructor(private authService: AuthService, private router: Router,private route: ActivatedRoute,private userService: UserService,private snackBar: MatSnackBar,private isAdminService:IsAdminService,private tableauService :TableauxService)  {}

getAllUsers(): void {
  this.userService.getAllUser().subscribe(
    (data) => {
      this.users = data;
    },
    (error) => {
      console.log('Error fetching users:', error);
      // Affichez ou gérez l'erreur de manière appropriée
    }
  );
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




logout(): void {
    this.authService.logout(); 
    
          localStorage.removeItem('access_token');
          
    this.router.navigate(['/login']);// Appel de la méthode logout() du service AuthService
  }
  deleteUser(user: Utilisateur): void {
    const snackBarRef = this.snackBar.open(`Are you sure you want to delete user ${user.firstname} (${user.email})?`, 'Confirm', {
      duration: 5000, // Durée pendant laquelle le snackbar est affiché (en ms)
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });

    snackBarRef.onAction().subscribe(() => {
      // Si l'utilisateur clique sur le bouton "Confirm" dans le snackbar
      if (user.id) {
        this.userService.deleteUser(user.id).subscribe(
          () => {
            this.users = this.users.filter(u => u !== user);
            this.snackBar.open(`User ${user.firstname} (${user.email}) deleted successfully`, 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            });
          },
          (error) => {
            console.error('Error deleting user:', error);
            this.snackBar.open('Error deleting user', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            });
          }
        );
      } else {
        console.error('User ID is undefined.');
      }
    });
  }
  getImageUrl(filename: string): string {
    return `http://localhost:8087/nour/api/v1/auth/get-image/${filename}`;
  }
  
  onRoleChange(user: Utilisateur): void {
    if (user.id && user.role) {
      this.userService.changerRoleUtilisateur(user.id, user.role)
        .subscribe(
          (data: Utilisateur) => {
            console.log('Mise à jour du rôle réussie : ', data);
            this.snackBar.open(`Role updated successfully for ${user.firstname} (${user.email})`, 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            });
          },
          (error) => {
            console.error('Erreur lors de la mise à jour du rôle : ', error);
            this.snackBar.open('Error updating role', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            });
          }
        );
    } else {
      console.error('User ID or Role is undefined.');
    }
  }
  showTableForm(): void {
    this.displayTableForm = true;
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
}  
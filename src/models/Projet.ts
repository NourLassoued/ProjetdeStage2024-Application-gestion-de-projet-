import { Carte } from "./Carte";
import { Tableau } from "./Tableau";
import { Utilisateur } from "./Utilisateur";

export class Projet {
    idProjet?: number;
    nom?: string;
    description?: string;
    tableau!: Tableau; // Assuming Tableau interface matches the structure
    cartes!: Carte[];
    utilisateurs!: Utilisateur[]; // Assuming Utilisateur interface matches the structure
  }
import { Projet } from "./Projet";
import { Utilisateur } from "./Utilisateur";

export class Tableau {
    idTableau?: number;
    nom?: string;
    description?: string;
    proprietaire!: Utilisateur; // Assuming Utilisateur interface matches User structure
    projets!: Projet[];
  }
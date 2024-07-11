import { Commentaire } from "./Commentaire";
import { Projet } from "./Projet";

export class Carte {
  idCarte?: number;
  titre?: string;
  description?: string;
 
 
  projet!: Projet | null; ; // Assuming Projet interface matches the structure
  commentaires!: Commentaire[]; // Assuming Commentaire interface matches the structure
}

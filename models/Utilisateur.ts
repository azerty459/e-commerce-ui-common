import {Role} from './Role';

export class Utilisateur {
  public role: Role;

  constructor(
    public id: number,
    public email: string,
    public prenom: string,
    public nom: string,
    public mdp?: string
  ) {
  }

  public static clone(utilisateur: Utilisateur): Utilisateur {
    const clone = new Utilisateur(utilisateur.id, utilisateur.email, utilisateur.prenom, utilisateur.nom, utilisateur.mdp);
    clone.role = Role.clone(utilisateur.role);
    return clone;
  }

  public static equals(utilisateur1: Utilisateur, utilisateur2: Utilisateur): boolean {
    if (utilisateur1 === utilisateur2) {
      return true;
    }
    if (utilisateur1 === undefined || utilisateur2 === undefined) {
      return false;
    }
    let retour = utilisateur1.id === utilisateur2.id;
    retour = retour && utilisateur1.email === utilisateur2.email;
    retour = retour && utilisateur1.prenom === utilisateur2.prenom;
    retour = retour && utilisateur1.nom === utilisateur2.nom;
    retour = retour && utilisateur1.mdp === utilisateur2.mdp;
    retour = retour && (
      (utilisateur1.role === undefined && utilisateur2.role === undefined) ||
      (utilisateur1.role !== undefined && Role.equals(utilisateur1.role, utilisateur2.role))
    );
    return retour;
  }
}



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
}



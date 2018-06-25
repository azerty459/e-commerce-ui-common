import {Role} from "./Role";

export class Utilisateur {

  constructor(
    public id: number,
    public email: string,
    public prenom: string,
    public nom: string,
    public mdp?: string,
    public roles= new Array<Role>()
  ) {}
}



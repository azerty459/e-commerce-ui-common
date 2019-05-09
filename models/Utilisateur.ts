export class Utilisateur {
  public role;

  constructor(
    public id: number,
    public email: string,
    public prenom: string,
    public nom: string,
    public mdp?: string
  ) {
  }
}



import {Utilisateur} from './Utilisateur';

export class Token {
  constructor(
    private _utilisateur: Utilisateur
  ) {
  }

  get utilisateur(): Utilisateur {
    return this._utilisateur;
  }

  set utilisateur(value: Utilisateur) {
    this._utilisateur = value;
  }

  private _token: string;
  get token(): string {
    return this._token;
  }

  set token(value: string) {
    this._token = value;
  }
}



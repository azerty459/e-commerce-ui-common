/**
 * Permet de creer des messages d'alerte
 */
export class MessageAlerte {
  constructor() {
  }

  private _message: string;

  get message(): string {
    return this._message;
  }

  set message(value: string) {
    this._message = value;
  }
}



import {Injectable} from '@angular/core';
import {Utilisateur} from '../models/Utilisateur';
import {UtilisateurDataService} from './data/utilisateur-data.service';
import {throwError as observableThrowError} from 'rxjs/index';

/**
 * Business permettant de gérer les requêtes au niveau de l'api pour l'objet utilisateur.
 */

@Injectable()
export class UtilisateurService {

  private utilisateur: Utilisateur;


  constructor(private utilisateurData: UtilisateurDataService) {
    this.utilisateur = new Utilisateur(null, null, null, null, null);
  }

  public async getById(id: number) {
    const retour = await this.utilisateurData.getUtilisateurById(id);
    return retour;
  }

  public add(utilisateur: Utilisateur) {
    const result = this.utilisateurData.addUtilisateur(utilisateur);
    return result.then((success: Utilisateur) => {
      return success;
    }, (error) => {
      return error.error;
    }).catch(this.handleError);
  }

  public update(utilisateur: Utilisateur) {
    const result = this.utilisateurData.updateUtilisateur(utilisateur);
    return result.then((success: Utilisateur) => {
      return success;
    }, (error) => {
      return error.error;
    }).catch(this.handleError);
  }

  public async delete(utilisateur: Utilisateur) {
    return await this.utilisateurData.deleteUtilisateur(utilisateur);
  }

  public getUtilisateur() {
    return this.utilisateur;
  }

  public setUtilisateur(utilisateur: Utilisateur) {
    this.utilisateur = utilisateur;
  }

  /**
   * Retourne une erreur si le business n'a pas pu exécuter le post
   * @param {Response | any} error Erreur à afficher ou rien
   * @returns {ErrorObservable} Un observable contenant l'erreur
   */
  private handleError(error: Response | any) {
    console.error('ApiService::handleError', error);
    return observableThrowError(error);
  }
}




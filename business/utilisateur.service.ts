import {Injectable} from '@angular/core';
import {Utilisateur} from '../models/Utilisateur';
import {UtilisateurData2Service} from './data/utilisateurData.service';

/**
 * Business permettant de gérer les requêtes au niveau de l'api pour l'objet utilisateur.
 */

@Injectable()
export class UtilisateurService {

  private utilisateur: Utilisateur;


  constructor(private utilisateurData: UtilisateurData2Service) {
    this.utilisateur = new Utilisateur(null, null, null, null, null);
  }

  public async getById(id: number) {
    const retour = await this.utilisateurData.getUtilisateurById(id);
    return retour;
  }

  public async add(utilisateur: Utilisateur) {
    return await this.utilisateurData.addUtilisateur(utilisateur);
  }

  public async update(utilisateur: Utilisateur) {
    return await this.utilisateurData.updateUtilisateur(utilisateur);
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
}




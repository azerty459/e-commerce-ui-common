
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

import { Categorie } from '../models/Categorie';
import { environment } from '../../src/environments/environment';
import {Pagination} from "../models/Pagination";
import {UtilisateurDataService} from "./data/utilisateur-data.service";
import {Utilisateur} from "../models/Utilisateur";

/**
 * Business permettant de gérer les requêtes au niveau de l'api pour l'objet catégorie.
 */

@Injectable()
export class UtilisateurService {

  private utilisateur: Utilisateur;

  constructor(private utilisateurData: UtilisateurDataService) {
    this.utilisateur = new Utilisateur(null, null, null , null, null);
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




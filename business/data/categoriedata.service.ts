import { Injectable } from '@angular/core';
import { Categorie} from '../../models/Categorie';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { environment } from '../../../src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriedataService {
  public idLastDeletedCategorie: number;
  constructor(private http: HttpClient) { }


  /**
   * Prend une catégorie en paramètre et retourne la même mais avec le champs "chemin" renseigné
   * @param {Categorie} cat la catégorie dont on cherche le chemin
   * @returns {Promise<any>} Une promesse de la catégorie avec le chemin renseigné
   */
  public getChemin(): Promise<any> {

    // Récupérer toutes les catégories
    const postResult = this.http.post(environment.api_url, { query: '{ categories { id nom level chemin } }'});

    // fabrication de la promesse
    const promise = new Promise<any>( (resolve, reject) => {

      postResult.toPromise().then( (response) => {
        resolve(response['categories']);
        }
      );
    });

    return promise;
  }
  public moveCategorie(categorieParent: Categorie, categorieEnfant: Categorie) {
    // On récupère l'objet Observable retourné par la requête post
    if (categorieEnfant === undefined) {
      categorieEnfant = new Categorie(0, '', null, null);
    }
    const postResult = this.http.post(environment.api_url, {
      query: 'mutation { moveCategorie(idADeplacer:' + categorieParent.id + ',idNouveauParent:' + categorieEnfant.id + ')}'
    });
    // On créer une promesse
    const promise = new Promise<any>((resolve) => {
      postResult
      // On transforme en promesse
        .toPromise()
        .then(
          response => {
           console.log(response);
            // On résout notre promesse
            resolve(null);
          }
        )
    });
    return promise;
  }

  /**
   * Methode permettant l'envoi de la requéte afin de restaurer la dernière catégorie supprimée
   * @returns {Promise<any>} true si succès false si echec
   */
  public restoreLastDeletedCategorie(): Promise<number> {
    if (this.idLastDeletedCategorie === undefined){
      this.idLastDeletedCategorie = 0;
    }
    // On récupère l'objet Observable retourné par la requête post
    const postResult = this.http.post(environment.api_url, {
      query: 'mutation { restoreCategorie(idNouveauParent:' + this.idLastDeletedCategorie + ')}'
    });
    // On créer une promesse
    const promise = new Promise<any>((resolve) => {
      postResult
      // On transforme en promesse
        .toPromise()
        .then(
          response => {
            console.log(response);
            // On résout notre promesse
            resolve(response);
          }
        )
    });
    return promise;
  }

}

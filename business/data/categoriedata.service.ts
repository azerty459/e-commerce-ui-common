import { Injectable } from '@angular/core';
import { Categorie} from '../../models/Categorie';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { environment } from '../../../src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriedataService {

  constructor(private http: HttpClient) { }


  /**
   * Prend une catégorie en paramètre et retourne la même mais avec le champs "chemin" renseigné
   * @param {Categorie} cat la catégorie dont on cherche le chemin
   * @returns {Promise<any>} Une promesse de la catégorie avec le chemin renseigné
   */
  public getChemin(cat: Categorie): Promise<any> {

    // Récupérer toutes les catégories
    const postResult = this.http.post(environment.api_url, { query: '{ categories { id nom level chemin } }'});

    // fabrication de la promesse
    const promise = new Promise<any>( (resolve, reject) => {

      postResult.toPromise().then( (response) => {

         let resultcat = null;

         // Tri des catégories pour trouver celle entrée en paramètre
        response['categories'].forEach((c) => {
          if(c.id === cat.id) {
            resultcat = c;
          }
        });
        resolve(resultcat);
        }
      );
    });

    return promise;
  }



}

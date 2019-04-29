import {throwError as observableThrowError} from 'rxjs';
import {Injectable} from '@angular/core';
import {environment} from '../../src/environments/environment';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/observable/of';
import { Statistique } from '../models/Statistique';

/**
 * Business permettant de gérer les requêtes au niveau de l'api pour l'objet statistique.
 */

@Injectable()
export class StatistiqueBusiness {
  constructor(
      private http: HttpClient) {}

  /**
   * Retourne une erreur si le business n'a pas pu exécuter le post
   * @param {Response | any} error Erreur à afficher ou rien
   * @returns {ErrorObservable} Un observable contenant l'erreur
   */
  private handleError(error: Response | any) {
    console.error('ApiService::handleError', error);
    return observableThrowError(error);
  }

  /*
   * @returns {Promise<Produit>} Le résultat de la recherche du produit.
   */
  public getStatistique(): Promise<Statistique> {
    // On récupère l'objet Observable retourné par la requête post
    const postResult = this.http.post(environment.api_url, {query: '{nbProduit nbUtilisateur nbCategorie nbProduitCategorie {categorie nb} }'});
    // On créer une promesse
    const promise = new Promise<Statistique>((resolve) => {
      postResult
      // On transforme en promise
        .toPromise()
        .then(
          response => {
              console.log(response)
            const statistique: any = response;
            
            // On résout notre promesse
            resolve(new Statistique(statistique.nbProduit, statistique.nbUtilisateur, statistique.nbCategorie, statistique.nbProduitCategorie));
          }
        )
        .catch(this.handleError);
    });
    return promise;
  }
}
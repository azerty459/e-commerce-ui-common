import {throwError as observableThrowError} from 'rxjs';
import {Injectable} from '@angular/core';
import {environment} from '../../src/environments/environment';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/observable/of';
import {Statistique} from '../models/Statistique';

/**
 * Business permettant de gérer les requêtes au niveau de l'api pour l'objet statistique.
 */
@Injectable()
export class StatistiqueBusiness {
  constructor(
    private http: HttpClient) {
  }

  /*
   * @returns {Promise<Produit>} Le résultat de la recherche du produit.
   */
  public getStatistique(): Promise<Statistique> {

    const postResult = this.http.post<Statistique>(environment.api_url, {query: '{nbProduit nbUtilisateur nbCategorie nbProduitCategorie {categorie nb} }'});
    return postResult.toPromise();
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

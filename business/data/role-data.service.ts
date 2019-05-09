import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../src/environments/environment';
import {throwError as observableThrowError} from 'rxjs/index';
import {Produit} from '../../models/Produit';
import {Role} from '../../models/Role';

/**
 * Business permettant de gérer les requêtes au niveau de l'api pour l'objet produit.
 */


@Injectable({
  providedIn: 'root'
})
export class RoleDataService {

  constructor(private http: HttpClient) {
  }

  /**
   * Retourne une promise contenant une liste de role contenu dans la base de données.
   * @returns {Promise<Produit[]>} Un observable contenant une liste de produit
   */
  public getRole(): Promise<Role[]> {
    // On récupère l'objet Observable retourné par la requête post
    const postResult = this.http.post(environment.api_url, {query: '{ roles {id nom } }'});
    // On créer une promesse
    const promise = new Promise<Role[]>((resolve) => {
      postResult
      // On transforme en promise
        .toPromise()
        .then(
          response => {
            const roles = response['roles'];
            // On résout notre promesse
            console.log(response);
            resolve(roles.map((role) => new Role(role.id, role.nom)));
          }
        )
        .catch(this.handleError);
    });
    return promise;
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

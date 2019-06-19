import {throwError as observableThrowError} from 'rxjs';
import {Produit} from '../models/Produit';
import {Injectable} from '@angular/core';
import {environment} from '../../src/environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import 'rxjs/add/observable/of';
import {Avis} from '../models/Avis';
import 'rxjs/add/operator/map';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

/**
 * Business permettant de gérer les requêtes au niveau de l'api pour l'objet produit.
 */

@Injectable()
export class AvisService {
  constructor(private http: HttpClient) {


  }

  public ajoutAvis(avis: Avis): Promise<Produit> {
    // On récupère l'objet Observable retourné par la requête post
    const url = `${environment.api_url_avisClient}`;
    const postResult = this.http.post(url, avis, httpOptions);
    // On créer une promesse
    const promise = new Promise<any>((resolve) => {
      postResult
      // On transforme en promesse
        .toPromise()
        .then(
          response => {
            // On résout notre promesse
            resolve(response);
          }
        )
        .catch(this.handleError);
    });
    return promise;
  }

  public getAvis(produit: Produit): Promise<any> {
    // On récupère l'objet Observable retourné par la requête post
    const url = `${environment.api_url_avisClient}/allByRef/${produit.ref}`;
    const postResult = this.http.get<any>(url);
    // On créer une promesse
    const promise = new Promise<any>((resolve) => {
      postResult
      // On transforme en promesse
        .toPromise()
        .then(
          response => {
            const avis = response;
            // On résout notre promesse
            const arrayAvis = avis.map(
              (avis) => new Avis(avis.id, avis.description, avis.note, null, produit.ref)
            );
            console.log(arrayAvis);
            resolve(arrayAvis);
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



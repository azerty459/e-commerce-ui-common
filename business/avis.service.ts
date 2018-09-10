import {throwError as observableThrowError} from 'rxjs';
import {Observable, ObservableInput, Subject} from 'rxjs/index';
import {Produit} from '../models/Produit';
import {Injectable} from '@angular/core';
import {environment} from '../../src/environments/environment';
import {Pagination} from "../models/Pagination";
import {Categorie} from '../models/Categorie';
import {Photo} from '../models/Photo';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/observable/of';
import {PaginationDataService} from "./data/pagination-data.service";
import {FiltreService} from "./filtre.service";
import {ProduiDataService} from "./data/produitData.service";
import {Avis} from "../models/Avis";
import 'rxjs/add/operator/map';


/**
 * Business permettant de gérer les requêtes au niveau de l'api pour l'objet produit.
 */

@Injectable()
export class AvisService {
  constructor(private http: HttpClient) {



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

  public ajoutAvis(avis: Avis): Promise<Produit> {
    // On récupère l'objet Observable retourné par la requête post
    const postResult = this.http.post(environment.api_url, {query: 'mutation{addAvisClient(avis:{note:' +avis.note
      +',refProduit:"' + avis.refProduit + '",description:"'+ avis.description+'"}){id description note}}'});
    // On créer une promesse
    const promise = new Promise<Produit>((resolve) => {
      postResult
      // On transforme en promesse
        .toPromise()
        .then(
          response => {
            // On résout notre promesse
            resolve(response['addAvisClients']);
          }
        )
        .catch(this.handleError);
    });
    return promise;
  }
  public getAvis(produit: Produit): Promise<any> {
    // On récupère l'objet Observable retourné par la requête post
    const postResult = this.http.post(environment.api_url, {query: '{ avisClient(ref: "' + produit.ref + '") {id description note } }'});
    // On créer une promesse
    const promise = new Promise<Produit>((resolve) => {
      postResult
      // On transforme en promesse
        .toPromise()
        .then(
          response => {
            console.log(response['avisClient']);
            const avis = response['avisClient'];
            // On résout notre promesse
            const arrayAvis = avis.map(
              (avis) => new Avis(avis.id,avis.description,avis.note,null,produit.ref)
            );
            console.log(arrayAvis);
            resolve(arrayAvis);
          }
        )
        .catch(this.handleError);
    });
    return promise;
  }
}



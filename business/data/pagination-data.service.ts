import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { environment } from '../../../src/environments/environment';
import {throwError as observableThrowError} from "rxjs/index";
import {Pagination} from "../../models/Pagination";
import {Produit} from "../../models/Produit";
import {Utilisateur} from "../../models/Utilisateur";
import {Photo} from "../../models/Photo";
import {Role} from "../../models/Role";

/**
 * Business permettant de gérer les requêtes au niveau de l'api pour l'objet produit.
 */

@Injectable({providedIn: 'root'})
export class PaginationDataService {

  public paginationProduit:Pagination;

  constructor(private http: HttpClient) {
    this.paginationProduit = new Pagination(0,0,0,0,[]);
  }

  /**
   * Retourne une erreur si le business n'a pas pu exécuter le post
   * @param {Response | any} error Erreur à afficher ou rien
   * @returns {ErrorObservable} Un observable contenant l'erreur
   */
  private handleError(error: Response | any) {
    console.error('DataPagination::handleError', error);
    return observableThrowError(error);
  }


  /**
   * Retourne une page paginée selon les paramètres voulus.
   * @param {number} page La page souhaitant être affichée
   * @param {number} nombreDeProduit Le nombre de produits voulu dans la page
   * @returns {Observable<Pagination>} Un observable contenant un objet pagination
   */
  public getUtilisateur(page: number, nombreUtilisateur: number): Promise<Pagination> {
    const postResult = this.http.post(environment.api_url, {
      query: '{ pagination(type: "utilisateur", page: ' + page + ', npp: ' + nombreUtilisateur +
      ') { pageActuelle pageMin pageMax total utilisateurs { id email prenom nom role { id nom } } } }'
    });

    // On créer une promesse
    const promise = new Promise<Pagination>((resolve) => {
      postResult
      // On transforme en promise
        .toPromise()
        .then(
          response => {
            const pagination = response['pagination'];
            const arrayUtilisateur = pagination['utilisateurs'].map((utilisateur) => new Utilisateur( +
              utilisateur.id, utilisateur.email, utilisateur.prenom, utilisateur.nom));
            resolve(new Pagination(pagination.pageActuelle, pagination.pageMin, pagination.pageMax, pagination.total, arrayUtilisateur));
          }
        )
        .catch(this.handleError);
    });
    return promise;
  }

  /**
   * Retourne une page paginée selon les paramètres voulus.
   * @param {number} page La page souhaitant être affichée
   * @param {number} nombreDeProduit Le nombre de produits voulu dans la page
   * @returns {Observable<Pagination>} Un observable contenant un objet pagination
   */
  public getProduit(page: number, nombreDeProduit: number): Promise<Pagination> {

    const postResult = this.http.post(environment.api_url, {
      query: '{ pagination(type: "produit", page: ' + page + ', npp: ' + nombreDeProduit +
      ') { pageActuelle pageMin pageMax total produits { ref nom description prixHT } } }'
    });

    // On créer une promesse
    const promise = new Promise<Pagination>((resolve) => {
      postResult
      // On transforme en promise
        .toPromise()
        .then(
          response => {
            const pagination = response['pagination'];
            const array = pagination.produits.map((produit) => new Produit(produit.ref, produit.nom, produit.description, produit.prixHT));
            resolve(new Pagination(pagination.pageActuelle, pagination.pageMin, pagination.pageMax, pagination.total, array));
          }
        )
        .catch(this.handleError);
    });
    return promise;

  }
}

import { Observable } from 'rxjs/Rx';
import { Produit } from '../models/Produit';
import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {environment} from '../../src/environments/environment';
import {Pagination} from "../models/Pagination";


@Injectable()
export class ProduitBusiness {
  constructor(private http: Http) {}

  private handleError (error: Response | any) {
    console.error('ApiService::handleError', error);
    return Observable.throw(error);
  }

  public getProduit(): Observable<Produit[]> {
    return this.http.post(environment.api_url, { query: '{ produits {ref nom description prixHT } }'})
      .map(response => {
        const produits = response.json().produits;
        return produits.map((produit) => new Produit(produit.ref, produit.nom, produit.description, produit.prixHT));
      })
      .catch(this.handleError);
  }

  /**
   * Va chercher un seul produit grâce à sa référence
   * @param {string} refProduit La référence du produit recherché
   * @returns {Observable<Produit>} Le résultat de la recherche du produit.
   */
  public getProduitByRef(refProduit: string): Observable<Produit> {

    return this.http.post(environment.api_url, { query: '{ produits(ref: "' + refProduit + '") {ref nom description prixHT categories{nom} } }'})
      .map(response => {

        const produit = response.json().produits[0];
        return produit;

      }).catch(this.handleError);
  }

  public getProduitByPagination(page: number, nombreDeProduit: number): Observable<Pagination> {
    return this.http.post(environment.api_url, { query: '{ pagination(type: "produit", page: '+page+', npp: '+nombreDeProduit+') { pageActuelle pageMin pageMax total produits { ref nom description prixHT } } }'})

      .map(response => {
        const pagination = response.json().pagination;
        var array =  pagination.produits.map((produit) => new Produit(produit.ref,produit.nom, produit.description, produit.prixHT));
        return new Pagination(pagination.pageActuelle, pagination.pageMin, pagination.pageMax, pagination.total, array);
      })
      .catch(this.handleError);
  }

  public addProduit(ref: String, nom: String, description: String, prixHT: number): Observable<Produit> {
    return this.http.post(environment.api_url, { query: 'mutation {addProduit(ref: "' + ref + '", nom: "' + nom + '", description: "' + description + '", prixHT: ' + prixHT + ') { ref nom description prixHT}}'})
      .map(response => {
        const produit = response.json().addProduit;
        return new Produit(produit.ref, produit.nom, produit.description, produit.prixHT);
      })
      .catch(this.handleError);
  }

  public updateProduit(ref: String, nom: String, description: String, prixHT: number): Observable<Produit> {
    return this.http.post(environment.api_url, { query: 'mutation{updateProduit(ref: "' + ref + '", nom: "' + nom + '", description: "' + description + '", prixHT: ' + prixHT + ') { ref nom description prixHT}}'})
      .map(response => {
        console.log(response.json().updateProduit);
        const produit = response.json().updateProduit;
        return new Produit(produit.ref, produit.nom, produit.description, produit.prixHT);
      })
      .catch(this.handleError);
  }

  public deleteProduit(ref: String): Observable<Boolean> {
    console.log('mutation{deleteProduit(ref: "' + ref + '")}');
    return this.http.post(environment.api_url, { query: 'mutation{deleteProduit(ref: "' + ref + '")}'})
      .map(response => {
        console.log(response.json());
        return response.json().deleteProduit;
      })
      .catch(this.handleError);
  }
}



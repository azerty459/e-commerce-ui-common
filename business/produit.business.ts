import { Observable } from 'rxjs/Rx';
import { Produit } from '../models/Produit';
import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {environment} from '../../src/environments/environment';
import {Pagination} from "../models/Pagination";
import {Categorie} from "../models/Categorie";
import {Photo} from "../models/Photo";


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
   * Va chercher un produit correspondant à la ref indiqué en paramètre
   * On utilise un map pour récupérer un tableau (arrayCategorie) composé des différentes catégories du produit.
   * @param {string} refProduit La référence du produit recherché
   * @returns {Observable<Produit>} Le résultat de la recherche du produit.
   */
  public getProduitByRef(refProduit: string): Observable<Produit> {
    return this.http.post(environment.api_url, { query: '{ produits(ref: "' +
      refProduit + '") {ref nom description prixHT categories{id nom} photos {url} } }'})
      .map(response => {
        const produit = response.json().produits[0];
        const arrayCategorie = produit.categories.map(
          (categorie) => new Categorie(categorie.id, categorie.nom, categorie.level, categorie.chemin)
        );
        const arrayPhoto = produit.photos.map(
          (photo) => new Photo(environment.api_rest_download_url+photo.url,photo.url)
        );
        return new Produit(produit.ref, produit.nom, produit.description, produit.prixHT, arrayCategorie, arrayPhoto);
      }).catch(this.handleError);
  }

  public getProduitByPagination(page: number, nombreDeProduit: number): Observable<Pagination> {
    return this.http.post(environment.api_url, { query: '{ pagination(type: "produit", page: ' + page + ', npp: ' + nombreDeProduit +
      ') { pageActuelle pageMin pageMax total produits { ref nom description prixHT } } }'})

      .map(response => {
        const pagination = response.json().pagination;
        let array =  pagination.produits.map((produit) => new Produit(produit.ref, produit.nom, produit.description, produit.prixHT));
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
    return this.http.post(environment.api_url, { query: 'mutation{updateProduit(ref: "' + ref +
      '", nom: "' + nom + '", description: "' + description + '", prixHT: ' + prixHT + ') { ref nom description prixHT}}'})
      .map(response => {
        let produit = response.json().updateProduit;
        return new Produit(produit.ref, produit.nom, produit.description, produit.prixHT);
      })
      .catch(this.handleError);
  }

  public deleteProduit(ref: String): Observable<Boolean> {
    return this.http.post(environment.api_url, { query: 'mutation{deleteProduit(ref: "' + ref + '")}'})
      .map(response => {
        return response.json().deleteProduit;
      })
      .catch(this.handleError);
  }

  public addCategorieProduit(produit: Produit, categorie: Categorie): Observable<Produit> {
    return this.http.post(environment.api_url, { query: 'mutation{updateProduit(ref:"' + produit.ref + '",nouvelleCat: ' + categorie.id +
      '){ref nom categories{nom}}}'})
      .map(response => {
        let produit = response.json().updateProduit;
        let arrayCategorie = produit.categories.map((categorie) => new Categorie(categorie.id, categorie.nom, categorie.level, categorie.chemin));
        return new Produit(produit.ref, produit.nom, produit.description, produit.prixHT, arrayCategorie);
      })
      .catch(this.handleError);
  }

  public deleteCategorieProduit(produit: Produit, categorie: Categorie): Observable<any> {
    return this.http.post(environment.api_url, { query: 'mutation{updateProduit(ref:"' + produit.ref + '",supprimerCat:' + categorie.id + '){ref nom description prixHT categories{ id nom }}}'})
      .map(response => {
        return response.json().updateProduit;
      })
      .catch(this.handleError);
  }

  /**
   * Permet d'envoyer la photo au backend
   * @param {FormData} dataAEnvoyer regroupe l'ensemble des données a envoyer au backend sous forme de FormData
   * @return {Observable<Response>} La reponse du backend
   */
  public ajoutPhoto(dataAEnvoyer: FormData){
    return this.http.post(environment.api_rest_upload_url,dataAEnvoyer);
  }
}



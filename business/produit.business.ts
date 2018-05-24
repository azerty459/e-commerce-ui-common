import { Observable } from 'rxjs/Rx';
import { Produit } from '../models/Produit';
import {Injectable} from '@angular/core';
import {environment} from '../../src/environments/environment';
import {Pagination} from "../models/Pagination";
import {Categorie} from "../models/Categorie";
import {Photo} from "../models/Photo";
import {HttpClient} from "@angular/common/http";

/**
 * Business permettant de gérer les requêtes au niveau de l'api pour l'objet produit.
 */

@Injectable()
export class ProduitBusiness {
  constructor(private http: HttpClient) {}

  /**
   * Retourne une erreur si le business n'a pas pu exécuter le post
   * @param {Response | any} error Erreur à afficher ou rien
   * @returns {ErrorObservable} Un observable contenant l'erreur
   */
  private handleError (error: Response | any) {
    console.error('ApiService::handleError', error);
    return Observable.throw(error);
  }

  /**
   * Retourne un observable contenant une liste de produit contenu dans la base de données.
   * @returns {Observable<Produit[]>} Un observable contenant une liste de produit
   */
  public getProduit(): Observable<Produit[]> {
    return this.http.post(environment.api_url, { query: '{ produits {ref nom description prixHT } }'})
      .map(response => {
        const produits = response['produits'];
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
  //TODO remplacer toutes les valeurs dans les paramètres par un objet produit et appliquer ce changement dans le post.
  public getProduitByRef(refProduit: string): Observable<any> {
    return this.http.post(environment.api_url, { query: '{ produits(ref: "' +
      refProduit + '") {ref nom description prixHT categories{id nom} photos {url} } }'})
      .map(response => {
        if(response['produits'] == undefined){
          return response[0].message;
        }else{
          const produit = response['produits'][0];
          const arrayCategorie = produit.categories.map(
            (categorie) => new Categorie(categorie.id, categorie.nom, categorie.level, categorie.chemin)
          );
          const arrayPhoto = produit.photos.map(
            (photo) => new Photo(environment.api_rest_download_url+photo.url,photo.url)
          );
          return new Produit(produit.ref, produit.nom, produit.description, produit.prixHT, arrayCategorie, arrayPhoto);
        }
      }).catch(this.handleError);
  }

  /**
   * Retourne une page paginée selon les paramètres voulus.
   * @param {number} page La page souhaitant être affichée
   * @param {number} nombreDeProduit Le nombre de produits voulu dans la page
   * @returns {Observable<Pagination>} Un observable contenant un objet pagination
   */
  public getProduitByPagination(page: number, nombreDeProduit: number): Observable<Pagination> {
    return this.http.post(environment.api_url, { query: '{ pagination(type: "produit", page: ' + page + ', npp: ' + nombreDeProduit +
      ') { pageActuelle pageMin pageMax total produits { ref nom description prixHT } } }'})

      .map(response => {
        const pagination = response['pagination'];
        let array =  pagination.produits.map((produit) => new Produit(produit.ref, produit.nom, produit.description, produit.prixHT));
        return new Pagination(pagination.pageActuelle, pagination.pageMin, pagination.pageMax, pagination.total, array);
      })
      .catch(this.handleError);
  }

  /**
   * Ajoute un produit.
   * @param {Produit} produit Le produit à ajouter
   * @returns {Observable<any>} Un observable contenant soit l'objet produit ou une erreur du back-end selon le JSON retourné.
   */
  public addProduit(produit: Produit): Observable<any> {
    if(produit.description == null){
      produit.description = '';
    }
    return this.http.post(environment.api_url, { query: 'mutation {addProduit(ref: "' + produit.ref + '", nom: "' + produit.nom + '", description: "' + produit.description + '", prixHT: ' + produit.prixHT + ') { ref nom description prixHT}}'})
      .map(response => {
        if(response['addProduit'] == undefined){
          return response;
        }else{
          const produit = response['addProduit'];
          return new Produit(produit.ref, produit.nom, produit.description, produit.prixHT);
        }
      })
      .catch(this.handleError);
  }

  //TODO remplacer toutes les valeurs dans les paramètres par un objet produit et appliquer ce changement dans le post.
  public updateProduit(ref: String, nom: String, description: String, prixHT: number): Observable<Produit> {
    return this.http.post(environment.api_url, { query: 'mutation{updateProduit(ref: "' + ref +
      '", nom: "' + nom + '", description: "' + description + '", prixHT: ' + prixHT + ') { ref nom description prixHT}}'})
      .map(response => {
        let produit = response['updateProduit'];
        return new Produit(produit.ref, produit.nom, produit.description, produit.prixHT);
      })
      .catch(this.handleError);
  }

  //TODO remplacer toutes les valeurs dans les paramètres par un objet produit et appliquer ce changement dans le post.
  public deleteProduit(ref: String): Observable<Boolean> {
    return this.http.post(environment.api_url, { query: 'mutation{deleteProduit(ref: "' + ref + '")}'})
      .map(response => {
        return response['deleteProduit'];
      })
      .catch(this.handleError);
  }

  /**
   * Ajoute une catégorie à un produit
   * @param {Produit} produit L'objet produit qui va être associé à la catégorie
   * @param {Categorie} categorie L'objet catégorie associée au produit
   * @returns {Observable<Produit>} Retourne un obersable contenant un objet produit
   */
  public addCategorieProduit(produit: Produit, categorie: Categorie): Observable<Produit> {
    return this.http.post(environment.api_url, { query: 'mutation{updateProduit(ref:"' + produit.ref + '",nouvelleCat: ' + categorie.id +
      '){ref nom categories{nom}}}'})
      .map(response => {
        let produit = response['updateProduit'];
        let arrayCategorie = produit.categories.map((categorie) => new Categorie(categorie.id, categorie.nom, categorie.level, categorie.chemin));
        return new Produit(produit.ref, produit.nom, produit.description, produit.prixHT, arrayCategorie);
      })
      .catch(this.handleError);
  }

  /**
   * Supprime une catégorie à un produit
   * @param {Produit} produit L'objet produit qui va être désassocié de la catégorie
   * @param {Categorie} categorie L'objet catégorie associée au produit
   * @returns {Observable<any>} Retourne un observable contenant un boolean, true s'il est supprimé sinon false.
   */
  public deleteCategorieProduit(produit: Produit, categorie: Categorie): Observable<Boolean> {
    return this.http.post(environment.api_url, { query: 'mutation{updateProduit(ref:"' + produit.ref + '",supprimerCat:' + categorie.id + '){ref nom description prixHT categories{ id nom }}}'})
      .map(response => {
        return response['updateProduit'];
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



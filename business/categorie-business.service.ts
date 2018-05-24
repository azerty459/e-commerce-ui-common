import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { Categorie } from '../models/Categorie';
import { environment } from '../../src/environments/environment';
import {Pagination} from "../models/Pagination";
import {Produit} from "../models/Produit";

/**
 * Business permettant de gérer les requêtes au niveau de l'api pour l'objet catégorie.
 */

@Injectable()
export class CategorieBusinessService {

  constructor(private http: HttpClient) { }

  /**
   * Retourne une erreur si le business n'a pas pu exécuter le post
   * @param {Response | any} error Erreur à afficher ou rien
   * @returns {ErrorObservable} Un observable contenant l'erreur
   */
  private handleError (error: HttpErrorResponse | any) {
    console.error('Categorie Business::handleError', error);
    return Observable.throw(error);
  }

  /**
   * Méthode permettante de retourner toutes les categories présente dans la table du même nom.
   * @returns {Observable<Categorie[]>} Un observable qui contient un tableau de categorie
   */
  public getAllCategories(): Observable<Categorie[]> {

    // On récupère l'objet Observable retourné par la requête post
    const postResult = this.http.post(environment.api_url, { query: '{ categories { id nom level chemin } }' });

    return postResult
      // On mappe chaque objet du retour de la méthode post
      .map( response => {
        console.log(response);
        // De la réponse de post, on ne garde que la partie "categories" et on mappe chacun de ces objets en objet Categorie
        const categories = response['categories'];
        // Retourne un Array d'objets Categorie dans un Observable
        if(categories != undefined){
          return categories.map( (cat) => new Categorie(cat.id, cat.nom, cat.level, cat.chemin));
        }else{
          return null;
        }
      })
      .catch(this.handleError);
  }

  /**
   * Retourne une catégorie recherchée en fonction de l'id
   * @param {String} id ID de la catégorie à rechercher
   * @returns {Observable<any>} Un observable contenant un message d'erreur du back-end ou un objet catégorie
   */
  public getCategorieByID(id: String): Observable<any> {

    // On récupère l'objet Observable retourné par la requête post
    const postResult = this.http.post(environment.api_url, { query: '{ categories(id: '+id+'){ id nom level chemin } }' });

    return postResult
    // On mappe chaque objet du retour de la méthode post
      .map( response => {
        // De la réponse de post, on ne garde que la partie "categories"
        if(response['categories'] == undefined){
          return response[0].message;
        }else{
          const categorie = response['categories'][0];
          return new Categorie(categorie.id, categorie.nom, categorie.level, null);
        }
      })
      .catch(this.handleError);
  }

  /**
   * Retourne une page paginée selon les paramètres voulus.
   * @param {number} page La page souhaitant être affichée
   * @param {number} nombreDeCategorie Le nombre de produits voulu dans la page
   * @returns {Observable<Pagination>} Un observable contenant un objet pagination
   */
  public getCategorieByPagination(page: number, nombreDeCategorie: number): Observable<Pagination> {
    return this.http.post(environment.api_url, { query: '{ pagination(type: "categorie", page: ' + page + ', npp: ' + nombreDeCategorie +
      ') { pageActuelle pageMin pageMax total categories { id nom level chemin  } } }'})

      .map(response => {
        const pagination = response['pagination'];
        let array =  pagination.categories.map((categorie) => new Categorie(categorie.id, categorie.nom, categorie.level, categorie.chemin));
        return new Pagination(pagination.pageActuelle, pagination.pageMin, pagination.pageMax, pagination.total, array);
      })
      .catch(this.handleError);
  }

  /**
   * Aller chercher les sous-catégories et sa catégorie parente d'une catégorie
   * @param {string} nomCategorie la catégorie dont on cherche les sous-catégories et le parent.
   * @returns {Observable<Categorie[]>} Un tableau de catégories sous la forme d'un Observable.
   */
  // TODO faire les retours des messages d'erreur du back-end.
  public getDetails(nomCategorie: string): Observable<Categorie[]> {

    const result = this.http.post(environment.api_url,
      { query: '{ categories(nom: "' + nomCategorie + '") { id nom level chemin sousCategories { id nom level } parent { id nom level}}}'});

    return result
      .map( response => {

        let temp = {};
        temp['parent'] = response['categories'][0]['parent'];
        temp['sousCategories'] = response['categories'][0]['sousCategories'];

        return temp;

    })
      .catch(this.handleError);
  }

  /**
   * Ajoute une catégorie parente
   * @param {string} nomCategorie Nom de la catégorie parente
   * @returns {Observable<Categorie>} Un observable contenant un objet catégorie
   */
  // TODO faire les retours des messages d'erreur du back-end.
  public ajouterCategorieParent(nomCategorie: string): Observable<Categorie> {
    return this.http.post(environment.api_url, { query: 'mutation { addCategorieParent(nom: "' + nomCategorie + '") { id nom level }}'})
      .map(response => {
        if(response['addCategorieParent'] == undefined){
          return response[0].message;
        }else{
          const categorie = response['addCategorieParent'];
          return new Categorie(categorie.id, categorie.nom, categorie.level, null);
        }
      })
      .catch(this.handleError);
  }

  /**
   * Ajoute une catégorie enfant à une catégorie parente.
   * @param {string} nomCategorie Nom de la catégorie enfant à créer
   * @param {number} idPere ID de la catégorie père
   * @returns {Observable<any>} Un observable contenant un message d'erreur du back-end ou un objet catégorie.
   */
  public ajouterCategorieEnfant(nomCategorie: string, idPere: number): Observable<any> {
    return this.http.post(environment.api_url, { query: 'mutation { addCategorieEnfant(nom: "'
      + nomCategorie + '", pere: ' + idPere + ') { id nom level }}'})
      .map(response => {
        console.log(response);
        if(response['addCategorieEnfant'] == undefined){
          return response[0].message;
        }else{
          const categorie = response['addCategorieEnfant'];
          return new Categorie(categorie.id, categorie.nom, categorie.level, null);
        }
      })
      .catch(this.handleError);
  }

  /**
   * Supprime une catégorie en fonction de l'id
   * @param {number} id Id de la catégorie à supprimer
   * @returns {Observable<Boolean>} Un observable contenant un boolean
   */
  // TODO remplacer les paramètres par l'objet en question et appliquer ce changement dans le http.post
  public supprimerCategorie(id: number): Observable<Boolean> {
    return this.http.post(environment.api_url, { query: 'mutation { deleteCategorie(id: ' + id + ')}'})
      .map(response => {
        return response['deleteCategorie'];
      })
      .catch(this.handleError);
  }
}




import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { Categorie } from '../models/Categorie';
import { environment } from '../../src/environments/environment';
import {Pagination} from "../models/Pagination";
import {Produit} from "../models/Produit";
import {promise} from "selenium-webdriver";

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
   * Méthode permettante de retourner toutes les categories présente dans la table catégorie.
   * @returns {Promise<Categorie[]>} Une promise qui renvoi un tableau de categorie
   */
  public getAllCategories(): Promise<Categorie[]> {
    // On récupère l'objet Observable retourné par la requête post
    const postResult = this.http.post(environment.api_url, { query: '{ categories { id nom level chemin } }' });
    let promise = new Promise<Categorie[]>((resolve) => {
      postResult
      // On transforme en promise
        .toPromise()
        .then(
          response =>{
            const categories = response['categories'];
            // De la réponse de post, on ne garde que la partie "categories" et on mappe chacun de ces objets en objet Categorie
            if(categories != undefined){
              resolve(categories.map( (cat) => new Categorie(cat.id, cat.nom, cat.level, cat.chemin)));
            }
          }
        )
        .catch(this.handleError);
    });
    return promise;
  }

  /**
   * Retourne une catégorie recherchée en fonction de l'id
   * @param {String} id ID de la catégorie à rechercher
   * @returns {Observable<any>} Un observable contenant un message d'erreur du back-end ou un objet catégorie
   */
  public getCategorieByID(id: String): Promise<any> {
    // On récupère l'objet Observable retourné par la requête post
    const postResult = this.http.post(environment.api_url, { query: '{ categories(id: '+id+'){ id nom level chemin } }' });
    let promise = new Promise((resolve, reject) => {
      postResult
      // On transforme en promise
        .toPromise()
        .then(
          response =>{
            if(response['categories'] == undefined){
              return response[0].message;
            }else{
              const categorie = response['categories'][0];
              resolve(new Categorie(categorie.id, categorie.nom, categorie.level, null));
            }
            reject();
          }
        )
        .catch(this.handleError);
    });
    return promise;
  }

  /**
   * Retourne une page paginée selon les paramètres voulus.
   * @param {number} page La page souhaitant être affichée
   * @param {number} nombreDeCategorie Le nombre de produits voulu dans la page
   * @returns {Observable<Pagination>} Un observable contenant un objet pagination
   */
  public getCategorieByPagination(page: number, nombreDeCategorie: number): Promise<Pagination> {
    // On récupère l'objet Observable retourné par la requête post
    const postResult = this.http.post(environment.api_url, { query: '{ pagination(type: "categorie", page: ' + page + ', npp: ' + nombreDeCategorie +
      ') { pageActuelle pageMin pageMax total categories { id nom level chemin  } } }'})
    let promise = new Promise<Pagination>((resolve) => {
      postResult
      // On transforme en promise
        .toPromise()
        .then(
          response =>{
            const pagination = response['pagination'];
            let array =  pagination.categories.map((categorie) => new Categorie(categorie.id, categorie.nom, categorie.level, categorie.chemin));
            resolve(new Pagination(pagination.pageActuelle, pagination.pageMin, pagination.pageMax, pagination.total, array));
          }
        )
        .catch(this.handleError);
    });
    return promise;
  }

  /**
   * Aller chercher les sous-catégories et sa catégorie parente d'une catégorie
   * @param {string} nomCategorie la catégorie dont on cherche les sous-catégories et le parent.
   * @returns {Promise<any>} Une promise retournant un tableau de catégories ou un message d'erreur venant de l'api.
   */
  public getDetails(nomCategorie: string): Promise<any> {
    // On récupère l'objet Observable retourné par la requête post
    const postResult = this.http.post(environment.api_url,
      { query: '{ categories(nom: "' + nomCategorie + '") { id nom level chemin sousCategories { id nom level } parent { id nom level}}}'});
    let promise = new Promise<any>((resolve) => {
      postResult
      // On transforme en promise
        .toPromise()
        .then(
          response =>{
            let retour;
            if(response['categories'] == undefined){
              retour = response[0].message;
            }else{
              let temp = {};
              temp['parent'] = response['categories'][0]['parent'];
              temp['sousCategories'] = response['categories'][0]['sousCategories'];
              retour = temp;
            }
            resolve(retour);
          }
        )
        .catch(this.handleError);
    });
    return promise;
  }

  /**
   * Ajoute une catégorie parente
   * @param {string} nomCategorie Nom de la catégorie parente
   * @returns {Observable<Categorie>} Un observable contenant un objet catégorie
   */
  // TODO faire les retours des messages d'erreur du back-end.
  public ajouterCategorieParent(nomCategorie: string): Promise<any> {
    // On récupère l'objet Observable retourné par la requête post
    const postResult = this.http.post(environment.api_url, { query: 'mutation { addCategorieParent(nom: "' + nomCategorie + '") { id nom level }}'});
    let promise = new Promise<any>((resolve) => {
      postResult
      // On transforme en promise
        .toPromise()
        .then(
          response =>{
            let retour;
            if(response['addCategorieParent'] == undefined){
              retour = response[0].message;
              console.log(retour.valueOf());
            }else{
              const categorie = response['addCategorieParent'];
              retour = new Categorie(categorie.id, categorie.nom, categorie.level, null);
            }
            resolve(retour);
          }
        )
        .catch(this.handleError);
    });
    return promise;
  }

  /**
   * Ajoute une catégorie enfant à une catégorie parente.
   * @param {string} nomCategorie Nom de la catégorie enfant à créer
   * @param {number} idPere ID de la catégorie père
   * @returns {Promise<any>} Une promesse contenant un message d'erreur du back-end ou un objet catégorie.
   */
  public ajouterCategorieEnfant(nomCategorie: string, idPere: number): Promise<any> {
    const postResult = this.http.post(environment.api_url, { query: 'mutation { addCategorieEnfant(nom: "'
      + nomCategorie + '", pere: ' + idPere + ') { id nom level }}'});
    let promise = new Promise<any>((resolve) => {
      postResult
      // On transforme en promise
        .toPromise()
        .then(
          response =>{
            let retour;
            if(response['addCategorieEnfant'] == undefined){
              retour = response[0].message;
            }else{
              const categorie = response['addCategorieEnfant'];
              retour = new Categorie(categorie.id, categorie.nom, categorie.level, null);
            }
            resolve(retour);
          }
        )
        .catch(this.handleError);
    });
    return promise;
  }

  /**
   * Supprime une catégorie
   * @param {Categorie} categorie L'objet de la catégorie à supprimer
   * @returns {Promise<Boolean>} Une promesse retournant vraie si la catégorie a été supprimé sinon faux
   */
  public supprimerCategorie(categorie: Categorie): Promise<boolean> {
    // On récupère l'objet Observable retourné par la requête post
    const postResult = this.http.post(environment.api_url, { query: 'mutation { deleteCategorie(id: ' + categorie.id + ')}'});
    let promise = new Promise<boolean>((resolve) => {
      postResult
      // On transforme en promise
        .toPromise()
        .then(
          response =>{
            resolve(response['deleteCategorie']);
          }
        )
        .catch(this.handleError);
    });
    return promise;
  }
}




import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { Categorie } from '../models/Categorie';
import { environment } from '../../src/environments/environment';



@Injectable()
export class CategorieBusinessService {

  constructor(private http: HttpClient) { }

  private handleError (error: HttpErrorResponse | any) {
    console.error('ApiService::handleError', error);
    return Observable.throw(error);
  }

  /**
   * Retourne toutes les catégories.
   * @returns {Observable<Categorie[]>} la liste des catégories
   */
  public getAllCategories(): Observable<Categorie[]> {

    // On récupère l'objet Observable retourné par la requête post
    const postResult = this.http.post(environment.api_url, { query: '{ categories { id nom level chemin } }' });

    return postResult
      // On mappe chaque objet du retour de la méthode post
      .map( response => {
        // De la réponse de post, on ne garde que la partie "categories" et on mappe chacun de ces objets en objet Categorie
        const categories = response['categories'];

        // Retourne un Array d'objets Categorie dans un Observable
        return categories.map( (cat) => new Categorie(cat.id, cat.nom, cat.level, cat.chemin));
      })
      .catch(this.handleError);
  }

  /**
   * Aller chercher les sous-catégories et sa catégorie parente d'une catégorie
   * @param {string} nomCategorie la catégorie dont on cherche les sous-catégories et le parent.
   * @returns {Observable<Categorie[]>} Un tableau de catégories sous la forme d'un Observable.
   */
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








  public ajouterCategorieParent(nomCategorie: string): Observable<Categorie> {
    return this.http.post(environment.api_url, { query: 'mutation { addCategorieParent(nom: "' + nomCategorie + '") { nom }}'})
      .catch(this.handleError);
  }

  public ajouterCategorieEnfant(nomCategorie: string, nomPere: string): Observable<Categorie> {
    return this.http.post(environment.api_url, { query: 'mutation { addCategorieEnfant(nom: "'
      + nomCategorie + '", pere: "' + nomPere + '") { nom }}'})
      .catch(this.handleError);
  }

  public supprimerCategorie(nomCategorie: string): Observable<Categorie> {
    return this.http.post(environment.api_url, { query: 'mutation { deleteCategorie(nom: "' + nomCategorie + '")}'})
      .catch(this.handleError);
  }





}




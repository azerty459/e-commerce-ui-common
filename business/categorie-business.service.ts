import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { Categorie } from '../models/Categorie';
import { environment } from '../../src/environments/environment';
import {parseHttpResponse} from 'selenium-webdriver/http';
import {Produit} from '../models/Produit';



@Injectable()
export class CategorieBusinessService {

  constructor(private http: HttpClient) { }

  private handleError (error: HttpErrorResponse | any) {
    console.error('Categorie Business::handleError', error);
    return Observable.throw(error);
  }

  public getAllCategories(): Observable<Categorie[]> {

    // On récupère l'objet Observable retourné par la requête post
    const postResult = this.http.post(environment.api_url, { query: '{ categories { id nom level chemin } }' });

    return postResult
      // On mappe chaque objet du retour de la méthode post
      .map( response => {
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
   * Aller chercher les sous-catégories d'une catégorie
   * @param {string} nomCategorie la catégorie dont on cherche les sous-catégories.
   * @returns {Observable<Categorie[]>} Un tableau de catégories sous la forme d'un Observable.
   */
  public sousCategories(nomCategorie: string): Observable<Categorie[]> {

    const result = this.http.post(environment.api_url,
      { query: '{ categories(nom: "' + nomCategorie + '") { nom sousCategories { nom }}}'});

    return result
      .map( response => {
        // tester si la réponse contient des sous-catégories
        if ( response['categories'] && response['categories'].length !== 0 ) {
          const categories = response['categories'][0]['sousCategories'];
          return categories.map( (sousCat) => new Categorie(sousCat.id, sousCat.nom, sousCat.level, sousCat.chemin));
        }
    })
      .catch(this.handleError);
  }




  public ajouterCategorieParent(nomCategorie: string): Observable<Categorie> {
    return this.http.post(environment.api_url, { query: 'mutation { addCategorieParent(nom: "' + nomCategorie + '") { nom }}'})
      .catch(this.handleError);
  }

  // public ajouterCategorieEnfant(nomCategorie: string, nomPere: string): Observable<Categorie> {
  //   return this.http.post(environment.api_url, { query: 'mutation { addCategorieEnfant(nom: "'
  //     + nomCategorie + '", pere: "' + nomPere + '") { nom }}'})
  //     .map(response => {
  //       console.log(response.json());
  //     })
  //     .catch(this.handleError);
  // }

  public ajouterCategorieEnfant(nomCategorie: string, nomPere: string): Observable<any> {
    return this.http.post(environment.api_url, { query: 'mutation { addCategorieEnfant(nom: "'
      + nomCategorie + '", pere: "' + nomPere + '") { id nom level }}'})
      .map(response => {
        const categorie = response['addCategorieEnfant'];
        if(categorie == undefined){
          return response[0].message;
        }else{
          return new Categorie(categorie.id, categorie.nom, categorie.level, null);
        }
      })
      .catch(this.handleError);
  }

  public supprimerCategorie(nomCategorie: string): Observable<Categorie> {
    return this.http.post(environment.api_url, { query: 'mutation { deleteCategorie(nom: "' + nomCategorie + '")}'})
      .catch(this.handleError);
  }
}




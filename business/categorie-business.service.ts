import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { Categorie } from '../models/Categorie';
import { environment } from '../../src/environments/environment';
<<<<<<< HEAD
=======


>>>>>>> US#193

@Injectable()
export class CategorieBusinessService {

  constructor(private http: HttpClient) { }

  private handleError (error: HttpErrorResponse | any) {
    console.error('Categorie Business::handleError', error);
    return Observable.throw(error);
  }

  /**
<<<<<<< HEAD
   * Méthode permettante de retourner toutes les categories présente dans la table du même nom.
   * @returns {Observable<Categorie[]>} Un observable qui contient un tableau de categorie
=======
   * Retourne toutes les catégories.
   * @returns {Observable<Categorie[]>} la liste des catégories
>>>>>>> US#193
   */
  public getAllCategories(): Observable<Categorie[]> {

    // On récupère l'objet Observable retourné par la requête post
    const postResult = this.http.post(environment.api_url, { query: '{ categories { id nom level chemin } }' });

    return postResult
      // On mappe chaque objet du retour de la méthode post
      .map( response => {
        // De la réponse de post, on ne garde que la partie "categories" et on mappe chacun de ces objets en objet Categorie
        const categories = response['categories'];
<<<<<<< HEAD
=======

>>>>>>> US#193
        // Retourne un Array d'objets Categorie dans un Observable
        if(categories != undefined){
          return categories.map( (cat) => new Categorie(cat.id, cat.nom, cat.level, cat.chemin));
        }else{
          return null;
        }
      })
      .catch(this.handleError);
  }

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

<<<<<<< HEAD
=======







>>>>>>> US#193
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

  public supprimerCategorie(id: number): Observable<Boolean> {
    return this.http.post(environment.api_url, { query: 'mutation { deleteCategorie(id: ' + id + ')}'})
      .map(response => {
        return response['deleteCategorie'];
      })
      .catch(this.handleError);
  }
}




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
    console.error('ApiService::handleError', error);
    return Observable.throw(error);
  }

  public getAllCategories(): Observable<Categorie[]> {

    // On récupère l'objet Observable retourné par la requête post
    const postResult = this.http.post(environment.api_url, { query: '{ categories { nom } }' });

    return postResult
      // On mappe chaque objet du retour de la méthode post
      .map( response => {

        // De la réponse de post, on ne garde que la partie "categories" et on mappe chacun de ces objets en objet Categorie
        const categories = response['categories'];
        return categories.map( (cat) => new Categorie(cat.nom)); // Retourne un Array d'objets Categorie
      })
      .catch(this.handleError);
  }
}


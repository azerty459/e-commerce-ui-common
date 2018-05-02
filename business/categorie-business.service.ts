import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { Categorie } from '../models/Categorie';
import {environment} from '../../src/environments/environment';



@Injectable()
export class CategorieBusinessService {

  constructor(private http: HttpClient) { }

  private handleError (error: HttpErrorResponse | any) {
    console.error('ApiService::handleError', error);
    return Observable.throw(error);
  }

  public getAllCategories(): Observable<Categorie[]> {

    return this.http.post(environment.api_url, '{ query: { getAllCategorie { nom }').catch(this.handleError);

    // A FAIRE: utiliser getAllCategories et l'utiliser dans le HTML pour voir ce qu'il y a dedans.



      // .map(response => {
      //   const categories = response.categories; // PROBLEME ICI
      //   return categories.map((categorie) =>
      //     new Categorie(categorie.id, categorie.nomCat, categorie.borneGauche, categorie.borneDroit, categorie.level));
      // })

  }

}


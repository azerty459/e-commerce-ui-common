import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Caracteristique} from '../../models/Caracteristique';
import {environment} from '../../../src/environments/environment';
import {Produit} from '../../models/Produit';
import 'rxjs-compat/add/operator/mergeAll';

@Injectable({
  providedIn: 'root'
})
export class CaracteristiqueDataService {


  constructor(private http: HttpClient) {}

  /**
   * Effectue la requête pour récupérer la liste de touts les caractéristiques disponibles et renvoie l'observable.
   */

  public getAll(): Observable<Caracteristique> {
    const requete = '{ caracteristiques { id label } }';
    const getResult: Observable<Object> = this.http.post<Object>(environment.api_url, {query: requete});
    return getResult
      .map(caracJson => Caracteristique.manyFromJson(caracJson))
      .flatMap(x => x);
  }

  /**
   * Effectue la requête pour ajouter une nouvelle Caractéristique et renvoie l'observable.
   */

  public addCaracteristique(carac: Caracteristique): Observable<any> {
    const requete = 'mutation{addCaracteristique(caracteristique: { ' +
      'label: "' + carac.label + '"})' +
      '{label}' +
      '}';
    return this.http.post<any>(environment.api_url, {query: requete});
  }

  /**
   * Effectue la requête pour ajouter plusieurs nouvelles Caractéristiques et renvoie l'observable.
   */

  public deleteCaracteristique(carac: Caracteristique): Observable<any> {
    const requete = 'mutation{deleteCaracteristique(id: ' + carac.id + ')}';
    return this.http.post<any>(environment.api_url, {query: requete});
  }

  /**
   * Effectue la requête pour ajouter des caractéristiques existantes à un produit et renvoie l'observable.
   */

  public linkCaracteristiqueToProduit(produit: Produit): Observable<any> {
    // TODO écrire la requête
    const requete = '';
    return this.http.post<any>(environment.api_url, {query: requete});
  }
}



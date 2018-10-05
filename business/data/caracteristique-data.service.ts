import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Caracteristique} from '../../models/Caracteristique';
import {environment} from '../../../src/environments/environment';
import {Produit} from '../../models/Produit';

@Injectable({
  providedIn: 'root'
})
export class CaracteristiqueDataService {


  constructor(private http: HttpClient) {}

  /**
   * Effectue la requête pour récupérer la liste de touts les caractéristiques disponibles et renvoie l'observable.
   */

  public getAllCaracteristiques(): Observable<Caracteristique> {
    const requete = '{ caracteristiques { nom profondeur} }';

    // TODO demander pour la fin de la requête graphql
    // TODO voir si ca passe avec observale Object, Object[] (ou any) et du coup .map ou .flatmap? ?
    const getResult: Observable<Object> = this.http.post<Object>(environment.api_url,
      {query: requete});
    return getResult.map(caracJson => Caracteristique.fromJson(caracJson));
  }

  /**
   * Effectue la requête pour ajouter une nouvelle Caractéristique et renvoie l'observable.
   */

  public addCaracteristique(carac: Caracteristique): Observable<any> {
    const requete = 'mutation{' +
      'addCaracteristique(caracteristique: { ' +
      'label: ${carac.label} ' +
      '})' +
      '{label}' +
      '}';
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



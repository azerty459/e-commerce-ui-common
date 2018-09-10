import { Injectable } from '@angular/core';
import { Categorie} from '../../models/Categorie';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { environment } from '../../../src/environments/environment';
import {throwError as observableThrowError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriedataService {
  public idLastDeletedCategorie: number;
  constructor(private http: HttpClient) { }
  private handleError (error: HttpErrorResponse | any) {
    console.error('Categorie Business::handleError', error);
    return observableThrowError(error);
  }


  /**
   * Prend une catégorie en paramètre et retourne la même mais avec le champs "chemin" renseigné
   * @param {Categorie} cat la catégorie dont on cherche le chemin
   * @returns {Promise<any>} Une promesse de la catégorie avec le chemin renseigné
   */
  public getChemin(): Promise<any> {

    // Récupérer toutes les catégories
    const postResult = this.http.post(environment.api_url, { query: '{ categories { id nom level chemin{id nom level} } }'});

    // fabrication de la promesse
    const promise = new Promise<any>( (resolve, reject) => {

      postResult.toPromise().then( (response) => {
        const categories = response['categories'];
        // De la réponse de post, on ne garde que la partie "categories" et on mappe chacun de ces objets en objet Categorie
        if (categories !== undefined) {
          // On résout notre promesse
          resolve(categories.map( (cat) => new Categorie(cat.id, cat.nom, cat.level, cat.chemin)));
        }
        }
      );
    });

    return promise;
  }
  public moveCategorie(categorieParent: Categorie, categorieEnfant: Categorie) {
    // On récupère l'objet Observable retourné par la requête post
    if (categorieEnfant === undefined) {
      categorieEnfant = new Categorie(0, '', null, null);
    }
    const postResult = this.http.post(environment.api_url, {
      query: 'mutation { moveCategorie(idADeplacer:' + categorieParent.id + ',idNouveauParent:' + categorieEnfant.id + ')}'
    });
    // On créer une promesse
    const promise = new Promise<any>((resolve) => {
      postResult
      // On transforme en promesse
        .toPromise()
        .then(
          response => {
           console.log(response);
            // On résout notre promesse
            resolve(null);
          }
        )
    });
    return promise;
  }

  /**
   * Methode permettant l'envoi de la requéte afin de restaurer la dernière catégorie supprimée
   * @returns {Promise<any>} true si succès false si echec
   */
  public async restoreLastDeletedCategorie(): Promise<any> {
    if (this.idLastDeletedCategorie === undefined){
      this.idLastDeletedCategorie = 0;
    }
    // On récupère l'objet Observable retourné par la requête post
    const postResult = this.http.post(environment.api_url, {
      query: 'mutation { restoreCategorie(idNouveauParent:' + this.idLastDeletedCategorie + '){id profondeur}}'
    });
    const promise = new Promise<any>((resolve) => {
      postResult
      // On transforme en promise
        .toPromise()
        .then(
          response => {
            // On résout notre promesse
            if (response['restoreCategorie'].length !== 0) {
              resolve(response['restoreCategorie'][0]);
            } else {
              // Pas de categorie
              console.log('pas de categorie');
              resolve([]);
            }
          }
        )
        .catch(this.handleError);
    });
    const response = await promise;
    const profondeur = response.profondeur;
    const id = response.id;
    if (profondeur != null && profondeur !== undefined) {

      //  Ici on ecrit la réquéte permettant d'otenir le Json representant l'arbre de categorie avec la bonne
      //  profondeur.
      let query = '{ categories(id:' + id + ') { nom id ';
      for (let i = 0; i < profondeur; i++) {
        query += 'sousCategories{ nom id ';
      }
      for (let i = 0; i < profondeur; i++) {
        query += '}';
      }
      query += '}}';

      // On execute cette requete
      const postResult = this.http.post(environment.api_url, {query: query});
      let promise = new Promise<any>((resolve) => {
        postResult
        // On transforme en promise
          .toPromise()
          .then(
            response => {
              // On résout notre promesse et on renvoi l'objet json
              resolve(response);
            }
          )
          .catch(this.handleError);
      });
      return promise;
    }
  }



}

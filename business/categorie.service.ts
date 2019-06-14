import {Observable, throwError as observableThrowError} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

import {Categorie} from '../models/Categorie';
import {environment} from '../../src/environments/environment';
import {Pagination} from '../models/Pagination';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

/**
 * Business permettant de gérer les requêtes au niveau de l'api pour l'objet catégorie.
 */

@Injectable()
export class CategorieBusinessService {
  constructor(
    private http: HttpClient) {
  }

  /**
   * Méthode permettante de retourner toutes les categories présente dans la table catégorie.
   * @returns {Promise<Categorie[]>} Une promise qui renvoi un tableau de categorie
   */
  public getAllCategories(): Promise<Categorie[]> {

    const url = `${environment.api_url_categorie}/all`;
    const postResult = this.http.get<any>(url);

    // On créer une promesse
    const promise = new Promise<Categorie[]>((resolve) => {
      postResult
      // On transforme en promise
        .toPromise()
        .then(
          response => {
            const categories = response;
            // De la réponse de post, on ne garde que la partie "categories" et on mappe chacun de ces objets en objet Categorie
            if (categories !== undefined) {
              // On résout notre promesse
              resolve(categories.map((cat) => new Categorie(cat.id, cat.nom, cat.level, cat.chemin)));
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
  public getCategorieByID(id: number): Promise<any> {
    const url = `${environment.api_url_categorie}/${id}`;
    const postResult = this.http.get<any>(url);
    // On créer une promesse
    let promise = new Promise((resolve, reject) => {
      postResult
      // On transforme en promise
        .toPromise()
        .then(
          response => {
            let retour;
            const categorie = response;
            retour = new Categorie(categorie.id, categorie.nom, categorie.level, null);
            // On résout notre promesse
            resolve(retour);
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
    const url = `${environment.api_url_pagination}/type/categorie/numPage/${page}/numberByPage/${nombreDeCategorie}`;
    const postResult = this.http.get<any>(url);
    // On créer une promesse
    let promise = new Promise<Pagination>((resolve) => {
      postResult
      // On transforme en promise
        .toPromise()
        .then(
          response => {
            const pagination = response;
            let array = pagination.categories.map((categorie) => new Categorie(categorie.id, categorie.nom, categorie.level, categorie.chemin));
            // On résout notre promesse
            resolve(new Pagination(pagination.pageActuelle, pagination.pageMin, pagination.pageMax, pagination.total, array));
          }
        )
        .catch(this.handleError);
    });
    return promise;
  }

  /**
   * Aller chercher les sous-catégories et sa catégorie parente d'une catégorie
   * @param {Categorie} categorie la catégorie dont on cherche les sous-catégories et le parent.
   * @returns {Promise<any>} Une promise retournant un tableau de catégories ou un message d'erreur venant de l'api.
   */
  //TODO faire que ça fonctionne avec un id à la place d'un nom
  public getDetails(categorie: Categorie): Promise<any> {
    const url = `${environment.api_url_categorie}/nom/${categorie.nomCat}`;
    const postResult = this.http.get<any>(url);
    // On créer une promesse
    let promise = new Promise<any>((resolve) => {
      postResult
      // On transforme en promise
        .toPromise()
        .then(
          response => {
            let retour;
            let temp = {};
            temp = response;
            retour = temp;
            // On résout notre promesse
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
  public ajouterCategorieParent(nomCategorie: string): Promise<any> {
    const url = `${environment.api_url_categorie}/nom/${nomCategorie}`;
    const postResult = this.http.post<any>(url, httpOptions);
    // On créer une promesse
    let promise = new Promise<any>((resolve) => {
      postResult
      // On transforme en promise
        .toPromise()
        .then(
          response => {
            let retour;
            const categorie = response;
            retour = new Categorie(categorie.id, categorie.nom, categorie.level, null);
            // On résout notre promesse
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
    const url = `${environment.api_url_categorie}/nom/${nomCategorie}/idEnfant/${idPere}`;
    const postResult = this.http.post<any>(url, httpOptions);
    // On créer une promesse
    let promise = new Promise<any>((resolve) => {
      postResult
      // On transforme en promise
        .toPromise()
        .then(
          response => {
            let retour;
            const categorie = response;
            retour = new Categorie(categorie.id, categorie.nom, categorie.level, null);
            // On résout notre promesse
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
    const url = `${environment.api_url_categorie}/${categorie.id}`;
    const postResult = this.http.get<any>(url);

    // On créer une promesse
    let promise = new Promise<boolean>((resolve) => {
      postResult
      // On transforme en promesse
        .toPromise()
        .then(
          response => {
            // On résout notre promesse
            resolve(response['deleteCategorie']);
          }
        )
        .catch(this.handleError);
    });
    return promise;
  }

  /**
   * Méthode permettante de retourner un objet Json representant l'arbre des categories
   * @returns {Observable<Categorie[]>} Un observable qui contient un objet json representant l'arbre des categories
   */
  public async getTree(): Promise<any> {
    // On récupère l'objet Observable retourné par la requête post qui permet d'obtenir la profondeur de l'arbre
    // formé par les categories
    const url = `${environment.api_url_categorie}/all`;
    const postResult = this.http.get<any>(url);
    //const postResult = this.http.post(environment.api_url, {query: '{ categories { nom profondeur} }'});
    let promise = new Promise<any>((resolve) => {
      postResult
      // On transforme en promise
        .toPromise()
        .then(
          response => {
            // On résout notre promesse
            console.log(response);
            if (response !== undefined) {
              resolve(response[0]['profondeur']);
            } else {
              // Pas de categorie*
              console.log('pas de categorie');
              resolve([]);
            }
          }
        )
        .catch(this.handleError);
    });
    const profondeur = await promise;
    if (profondeur != null && profondeur !== undefined) {

      //  Ici on ecrit la réquéte permettant d'otenir le Json representant l'arbre de categorie avec la bonne
      //  profondeur.
      let query = '{ categories { nom id ';
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

  // public async getTree(): Promise<any> {
  //   // On récupère l'objet Observable retourné par la requête post qui permet d'obtenir la profondeur de l'arbre
  //   // formé par les categories
  //   const url = `${environment.api_url_categorie}/all`;
  //   const postResult = this.http.get<any>(url);
  //   //const postResult = this.http.post(environment.api_url, {query: '{ categories { nom profondeur} }'});
  //   let promise = new Promise<any>((resolve) => {
  //     postResult
  //     // On transforme en promise
  //       .toPromise()
  //       .then(
  //         response => {
  //           // On résout notre promesse
  //           console.log(response);
  //           if (response !== undefined) {
  //             resolve(response);
  //           } else {
  //             // Pas de categorie*
  //             console.log('pas de categorie');
  //             resolve([]);
  //           }
  //         }
  //       )
  //       .catch(this.handleError);
  //   });
  //   const tableau: Categorie[] = await promise;
  //   let idcategorie: any;
  //   for (let i = 0; i < tableau.length; i++) {
  //     if (tableau[i].level === 1) {
  //       idcategorie = i;
  //     }
  //   }
  //   console.log(tableau[idcategorie]);
  //   return tableau[idcategorie];
  // }

  public updateCategorie(id: number, nouveauNom: string): Promise<any> {
    const url = `${environment.api_url_categorie}/nom/${nouveauNom}/id/${id}`;
    const postResult = this.http.put<any>(url, httpOptions);
    // On créer une promesse
    let promise = new Promise<any>((resolve) => {
      postResult
      // On transforme en promesse
        .toPromise()
        .then(
          response => {
            let retour;
            const categorie = response;
            retour = new Categorie(categorie.id, categorie.nom, categorie.level, null);
            // On résout notre promesse
            resolve(retour);
          }
        )
        .catch(this.handleError);
    });
    return promise;
  }

  /**
   * Retourne une erreur si le business n'a pas pu exécuter le post
   * @param {Response | any} error Erreur à afficher ou rien
   * @returns {ErrorObservable} Un observable contenant l'erreur
   */
  private handleError(error: HttpErrorResponse | any) {
    console.error('Categorie Business::handleError', error);
    return observableThrowError(error);
  }
}





import {throwError as observableThrowError} from 'rxjs';
import { ObservableInput} from 'rxjs/index';
import {Produit} from '../models/Produit';
import {Injectable} from '@angular/core';
import {environment} from '../../src/environments/environment';
import {Pagination} from "../models/Pagination";
import {Categorie} from "../models/Categorie";
import {Photo} from "../models/Photo";
import {HttpClient} from "@angular/common/http";

/**
 * Business permettant de gérer les requêtes au niveau de l'api pour l'objet produit.
 */

@Injectable()
export class ProduitBusiness {
  constructor(private http: HttpClient) {
  }

  /**
   * Retourne une erreur si le business n'a pas pu exécuter le post
   * @param {Response | any} error Erreur à afficher ou rien
   * @returns {ErrorObservable} Un observable contenant l'erreur
   */
  private handleError(error: Response | any) {
    console.error('ApiService::handleError', error);
    return observableThrowError(error);
  }

  /**
   * Retourne un observable contenant une liste de produit contenu dans la base de données.
   * @returns {Promise<Produit[]>} Un observable contenant une liste de produit
   */
  public getProduit(): Promise<Produit[]> {
    // On récupère l'objet Observable retourné par la requête post
    const postResult = this.http.post(environment.api_url, {query: '{ produits {ref nom description prixHT } }'});
    // On créer une promesse
    let promise = new Promise<Produit[]>((resolve) => {
      postResult
      // On transforme en promise
        .toPromise()
        .then(
          response =>{
            const produits = response['produits'];
            // On résout notre promesse
            resolve(produits.map((produit) => new Produit(produit.ref, produit.nom, produit.description, produit.prixHT)));
          }
        )
        .catch(this.handleError);
    });
    return promise;
  }

  /**
   * Recherche de produits dont le nom contient une chaîne de catactères donnée en paramètres.
   * @param {String} name la chaîne de catactères recherchée
   * @returns {Promise<Produit>} les produits trouvés
   */
  public getProduitByName(name: String): Promise<Produit[]> {

    const postResult = this.http.post(environment.api_url, {query: 'produits(nom:' +
      name + ') {ref nom description prixHT categories{id nom} photos {url}}'});

    const promise = new Promise<Produit[]>((resolve) => {
      postResult.toPromise().then((response) => {
        const produits = response['produits'];
        resolve(produits.map((produit) => new Produit(produit.ref, produit.nom, produit.description, produit.prixHT)));
      })
        .catch(this.handleError);
    });

    return promise;

  }

  /**
   * Va chercher un produit correspondant à la ref indiqué en paramètre
   * On utilise un map pour récupérer un tableau (arrayCategorie) composé des différentes catégories du produit.
   * @param {string} refProduit La référence du produit recherché
   * @returns {Promise<Produit>} Le résultat de la recherche du produit.
   */
  public getProduitByRef(refProduit: String): Promise<any> {
    // On récupère l'objet Observable retourné par la requête post
    const postResult = this.http.post(environment.api_url, {query: '{ produits(ref: "' + refProduit + '") {ref nom description prixHT categories{id nom} photos {url} } }'});
    // On créer une promesse
    let promise = new Promise<any>((resolve) => {
      postResult
      // On transforme en promise
        .toPromise()
        .then(
          response =>{
            const produits = response['produits'];
            // On résout notre promesse
            if (response['produits'] == undefined) {
              resolve(response[0].message);
            } else {
              const produit = response['produits'][0];
              const arrayCategorie = produit.categories.map(
                (categorie) => new Categorie(categorie.id, categorie.nom, categorie.level, categorie.chemin)
              );
              const arrayPhoto = produit.photos.map(
                (photo) => new Photo(environment.api_rest_download_url + photo.url, photo.url)
              );
              resolve (new Produit(produit.ref, produit.nom, produit.description, produit.prixHT, arrayCategorie, arrayPhoto));
            }
          }
        )
        .catch(this.handleError);
    });
    return promise;
  }

  /**
   * Retourne une page paginée selon les paramètres voulus.
   * @param {number} page La page souhaitant être affichée
   * @param {number} nombreDeProduit Le nombre de produits voulu dans la page
   * @returns {Observable<Pagination>} Un observable contenant un objet pagination
   */
  public getProduitByPagination(page: number, nombreDeProduit: number): Promise<Pagination> {
    // On récupère l'objet Observable retourné par la requête post
    const postResult = this.http.post(environment.api_url, {
      query: '{ pagination(type: "produit", page: ' + page + ', npp: ' + nombreDeProduit +
      ') { pageActuelle pageMin pageMax total produits { ref nom description prixHT } } }'
    });
    // On créer une promesse
    let promise = new Promise<Pagination>((resolve) => {
      postResult
      // On transforme en promise
        .toPromise()
        .then(
          response =>{
            const pagination = response['pagination'];
            let array = pagination.produits.map((produit) => new Produit(produit.ref, produit.nom, produit.description, produit.prixHT));
            resolve(new Pagination(pagination.pageActuelle, pagination.pageMin, pagination.pageMax, pagination.total, array));
          }
        )
        .catch(this.handleError);
    });
    return promise;
  }

  /**
   * Ajoute un produit.
   * @param {Produit} produit Le produit à ajouter
   * @returns {Observable<any>} Un observable contenant soit l'objet produit ou une erreur du back-end selon le JSON retourné.
   */
  public addProduit(produit: Produit): Promise<any> {
    if (produit.description == null) {
      produit.description = '';
    }
    // On récupère l'objet Observable retourné par la requête post
    const postResult = this.http.post(environment.api_url, {query: 'mutation {addProduit(ref: "' + produit.ref + '", nom: "' + produit.nom + '", description: "' + produit.description + '", prixHT: ' + produit.prixHT + ') { ref nom description prixHT}}'});
    // On créer une promesse
    let promise = new Promise<any>((resolve) => {
      postResult
      // On transforme en promise
        .toPromise()
        .then(
          response =>{
            if (response['addProduit'] == undefined) {
              resolve(response);
            } else {
              const produit = response['addProduit'];
              resolve(new Produit(produit.ref, produit.nom, produit.description, produit.prixHT, [], []));
            }
          }
        )
        .catch(this.handleError);
    });
    return promise;
  }

  public updateProduit(produit: Produit): Promise<Produit> {
    // On récupère l'objet Observable retourné par la requête post
    const postResult = this.http.post(environment.api_url, {
      query: 'mutation{updateProduit(ref: "' + produit.ref +
      '", nom: "' + produit.nom + '", description: "' + produit.description + '", prixHT: ' + produit.prixHT + ') { ref nom description prixHT}}'
    });
    // On créer une promesse
    let promise = new Promise<Produit>((resolve) => {
      postResult
      // On transforme en promise
        .toPromise()
        .then(
          response =>{
            let produit = response['updateProduit'];
            resolve(new Produit(produit.ref, produit.nom, produit.description, produit.prixHT));
          }
        )
        .catch(this.handleError);
    });
    return promise;
  }

  public deleteProduit(produit: Produit): Promise<boolean> {
    // On récupère l'objet Observable retourné par la requête post
    const postResult = this.http.post(environment.api_url, {query: 'mutation{deleteProduit(ref: "' + produit.ref + '")}'})
    // On créer une promesse
    let promise = new Promise<boolean>((resolve) => {
      postResult
      // On transforme en promise
        .toPromise()
        .then(
          response =>{
            resolve(response['deleteProduit']);
          }
        )
        .catch(this.handleError);
    });
    return promise;
  }

  /**
   * Ajoute une catégorie à un produit
   * @param {Produit} produit L'objet produit qui va être associé à la catégorie
   * @param {Categorie} categorie L'objet catégorie associée au produit
   * @returns {Observable<Produit>} Retourne un obersable contenant un objet produit
   */
  public addCategorieProduit(produit: Produit, categorie: Categorie): Promise<Produit> {
    // On récupère l'objet Observable retourné par la requête post
    const postResult = this.http.post(environment.api_url, {
      query: 'mutation{updateProduit(ref:"' + produit.ref + '",nouvelleCat: ' + categorie.id +
      '){ref nom description prixHT categories{id nom} photos {url} }}'
    });
    // On créer une promesse
    let promise = new Promise<Produit>((resolve) => {
      postResult
      // On transforme en promesse
        .toPromise()
        .then(
          response => {
            console.log(response);
            let produit = response['updateProduit'];
            let arrayCategorie = produit.categories.map((categorie) => new Categorie(categorie.id, categorie.nom, categorie.level, categorie.chemin));
            // On résout notre promesse
            resolve(new Produit(produit.ref, produit.nom, produit.description, produit.prixHT, arrayCategorie));
          }
        )
        .catch(this.handleError);
    });
    return promise;
  }

  /**
   * Supprime une catégorie à un produit
   * @param {Produit} produit L'objet produit qui va être désassocié de la catégorie
   * @param {Categorie} categorie L'objet catégorie associée au produit
   * @returns {Promise<boolean>} Retourne une promesse retournant un boolean, true s'il est supprimé sinon false.
   */
  public deleteCategorieProduit(produit: Produit, categorie: Categorie): Promise<Produit> {
    // On récupère l'objet Observable retourné par la requête post
    const postResult = this.http.post(environment.api_url, {query: 'mutation{updateProduit(ref:"' + produit.ref + '",supprimerCat:' + categorie.id + ') {ref nom description prixHT categories{id nom} photos {url} } }'});
    // On créer une promesse
    let promise = new Promise<Produit>((resolve) => {
      postResult
      // On transforme en promesse
        .toPromise()
        .then(
          response => {
            console.log(response);
            // On résout notre promesse
            resolve(response['updateProduit']);
          }
        )
        .catch(this.handleError);
    });
    return promise;
  }

  /**
   * Permet d'envoyer la photo au backend
   * @param {FormData} dataAEnvoyer regroupe l'ensemble des données a envoyer au backend sous forme de FormData
   * @return {Observable<Response>} La reponse du backend
   */
  public ajoutPhoto(dataAEnvoyer: FormData): Promise<any> {
    // On récupère l'objet Observable retourné par la requête post
    const postResult = this.http.post(environment.api_rest_upload_url, dataAEnvoyer);
    // On créer une promesse
    let promise = new Promise<any>((resolve) => {
      postResult
      // On transforme en promesse
        .toPromise()
        .then(
          response => {
            // On résout notre promesse
            resolve(response);
          }
        )
        .catch(this.handleError);
    });
    return promise;
  }


}



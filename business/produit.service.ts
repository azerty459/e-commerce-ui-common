import {throwError as observableThrowError} from 'rxjs';
import {Observable, Subject} from 'rxjs/index';
import {Produit} from '../models/Produit';
import {Injectable} from '@angular/core';
import {environment} from '../../src/environments/environment';
import {Pagination} from '../models/Pagination';
import {Categorie} from '../models/Categorie';
import {Photo} from '../models/Photo';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import 'rxjs/add/observable/of';
import {PaginationDataService} from './data/pagination-data.service';
import {FiltreService} from './filtre.service';
import {ProduiDataService} from './data/produit-data.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

/**
 * Business permettant de gérer les requêtes au niveau de l'api pour l'objet produit.
 */

@Injectable()
export class ProduitBusiness {
  public searchedCategorie: number;
  public searchedCategorieObject;
  public searchedText: string;
  public nbProduits: number;
  public searchDone = false;
  public subject: Subject<Pagination>;

  constructor(private http: HttpClient, private paginationDataService: PaginationDataService, private filtreService: FiltreService, private produitDataService: ProduiDataService) {

    // Observable mettant à jour l'observable donnant la liste des produits
    this.subject = new Subject<Pagination>();

  }

  /**
   * Retourne un observable contenant une liste de produit contenu dans la base de données.
   * @returns {Promise<Produit[]>} Un observable contenant une liste de produit
   */
  public async getProduit() {

    const url = `${environment.api_url_product}`;
    return await this.http.get<Produit>(url).toPromise();
  }

  /**
   * Va chercher un produit correspondant à la ref indiqué en paramètre
   * On utilise un map pour récupérer un tableau (arrayCategorie) composé des différentes catégories du produit.
   * @param {string} refProduit La référence du produit recherché
   * @returns {Promise<Produit>} Le résultat de la recherche du produit.
   */
  public getProduitByRef(refProduit: String): Promise<any> {
    const url = `${environment.api_url_product}/${refProduit}`;
    const postResult = this.http.get<any>(url);

    const promise = new Promise<any>((resolve) => {
      postResult
      // On transforme en promise
        .toPromise()
        .then(
          response => {

            // On résout notre promesse
            const produit = response;
            console.log(produit);
            const arrayCategorie = produit.categories.map(
              (categorie) => new Categorie(categorie.id, categorie.nom, categorie.level, categorie.chemin)
            );
            const arrayPhoto = produit.photos.map(
              (photo) => new Photo(photo.id, environment.api_rest_download_url + photo.url, photo.nom)
            );
            const resolvedProduct = new Produit(produit.ref, produit.nom, produit.description, produit.prixHT, produit.noteMoyenne, arrayCategorie, arrayPhoto);
            if (produit.photoPrincipale != null && produit.photoPrincipale != undefined) {
              resolvedProduct.photoPrincipale = new Photo(produit.photoPrincipale.id, environment.api_rest_download_url + produit.photoPrincipale.url, produit.photoPrincipale.nom);
            } else {
              resolvedProduct.photoPrincipale = new Photo(0, '', '');
            }
            resolve(resolvedProduct);

          }
        )
        .catch(this.handleError);
    });
    return promise;
  }

  /**
   * Communique avec l'API pour aller chercher le texte recherché et selon la pagination demandée
   * @param {number} page ne n° de page sur laquelle on est
   * @param {number} nombreDeProduit le nombre de produits à afficher sur la page
   * @param {string} text le texte recherché
   * @param categorieId
   * @returns {Promise<Pagination>} une promesse de Pagination
   */
  public getProduitByPaginationSearch(page: number, nombreDeProduit: number, text: string = '', categorieId: number = 0): Promise<Pagination> {


    if (page === undefined) {
      page = 1;
    }

    const url = `${environment.api_url_pagination}/type/produit/numPage/${page}/numberByPage/${nombreDeProduit}/nom/${text}/idCategorie/${categorieId}/orderBy/Nom`;
    const postResult = this.http.get<any>(url);


    const promise = new Promise<Pagination>((resolve, reject) => {

      postResult.toPromise().then(
        (response) => {
          const pagination = response;
          const array = [];
          pagination.produits.map((produit) => {
            const prod = new Produit(produit.ref, produit.nom, produit.description, produit.prixHT, produit.arrayPhoto);
            if (produit.photoPrincipale != null && produit.photoPrincipale != undefined) {
              prod.photoPrincipale = new Photo(produit.photoPrincipale.id, produit.photoPrincipale.url, produit.photoPrincipale.nom);
            } else {
              prod.photoPrincipale = new Photo(0, '', '');
            }
            array.push(prod);
          });
          console.log(array);
          resolve(new Pagination(pagination.pageActuelle, pagination.pageMin, pagination.pageMax, pagination.total, array));
        }
      );
    });
    this.searchDone = true;
    return promise;
  }

  /**
   * Va chercher les données à afficher selon la recherche donnée en paramètre
   * @param {string} text le texte recherché
   * @param idCategorie
   * @returns {Promise<void>}
   */
  public async search(text: string, idCategorie: number) {
    const result = await this.getProduitByPaginationSearch(this.paginationDataService.paginationProduit.pageActuelle, this.filtreService.getNbProduitParPage(), text, idCategorie);
    this.produitDataService.produits.arrayProduit = result.tableau;
    this.produitDataService.produits.length = result.total;
    this.paginationDataService.paginationProduit.pageActuelle = result.pageActuelle;
    this.paginationDataService.paginationProduit.pageMax = result.pageMax;
    this.paginationDataService.paginationProduit.total = result.total;
    this.paginationDataService.paginationProduit.tableau = result.tableau;
    this.paginationDataService.paginationProduit.pageMin = result.pageMin;
    // On est dans le cadre d'une recherche (sauf si la chaîne recherchée est de longueur 0)
    if (this.searchedText.length === 0) {
      console.log('pas de recherche texte vide');
    }
    // pour le fil d'arianne
    this.getSearchedCategorie();
  }

  public getSearchedCategorie() {
    const categorieNode = this.searchedCategorieObject;
    // 0 équivaut aucune catégorie existante
    if (categorieNode && categorieNode.id !== 0) {

      this.filtreService.categorieForBreadCrum = new Categorie(categorieNode.id, categorieNode.nomCategorie, undefined, undefined);
    } else {
      this.filtreService.categorieForBreadCrum = null;
    }

  }

  /**
   * Retourne une page paginée selon les paramètres voulus.
   * @param {number} page La page souhaitant être affichée
   * @param {number} nombreDeProduit Le nombre de produits voulu dans la page
   * @returns {Observable<Pagination>} Un observable contenant un objet pagination
   */
  public getProduitByPagination(page: number, nombreDeProduit: number, nameOfTri: String): Promise<Pagination> {

    // Stockage des valeurs de la pagination
    this.nbProduits = nombreDeProduit;

    const url = `${environment.api_url_pagination}/type/produit/numPage/${page}/numberByPage/${nombreDeProduit}/orderBy/${nameOfTri}`;
    const postResult = this.http.get<any>(url);

    // On créer une promesse
    const promise = new Promise<Pagination>((resolve) => {
      postResult
      // On transforme en promise
        .toPromise()
        .then(
          response => {
            const pagination = response;

            const array = pagination.produits.map((produit) => {

              const lesPhotos = produit.photos.map(
                (photo) => new Photo(photo.id, environment.api_rest_download_url + photo.url, photo.nom)
              );


              // Ajout des photos du produit
              const prod = new Produit(produit.ref, produit.nom, produit.description, produit.prixHT, produit.noteMoyenne);
              if (produit.photoPrincipale != undefined && produit.photoPrincipale) {
                prod.photoPrincipale = produit.photoPrincipale;
              }

              prod.arrayPhoto = lesPhotos;

              return prod;
            });
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

    const url = `${environment.api_url_product}`;
    const postResult = this.http.post<any>(url, produit, httpOptions);

    // On créer une promesse
    const promise = new Promise<Produit>((resolve) => {
      postResult
      // On transforme en promise
        .toPromise()
        .then(
          response => {
            const produit = response;
            resolve(new Produit(produit.ref, produit.nom, produit.description, produit.prixHT, produit.noteMoyenne, [], []));

          }
        )
        .catch(this.handleError);
    });
    return promise;
  }

  public updateProduit(produit: Produit): Promise<any> {


    const url = `${environment.api_url_product}`;
    if (produit.photoPrincipale.id === 0) {
      produit.photoPrincipale = null;
    }
    const postResult = this.http.put<any>(url, produit, httpOptions);

    // On créer une promesse
    const promise = new Promise<Produit>((resolve) => {
      postResult
      // On transforme en promise
        .toPromise()
        .then(
          response => {

            const produit = response;
            const arrayCategorie = produit.categories.map(
              (categorie) => new Categorie(categorie.id, categorie.nom, categorie.level, categorie.chemin)
            );
            const arrayPhoto = produit.photos.map(
              (photo) => new Photo(photo.id, environment.api_rest_download_url + photo.url, photo.nom)
            );
            const resolvedProduct = new Produit(produit.ref, produit.nom, produit.description, produit.prixHT, arrayCategorie, arrayPhoto);
            if (produit.photoPrincipale != null && produit.photoPrincipale != undefined) {
              resolvedProduct.photoPrincipale = new Photo(produit.photoPrincipale.id, environment.api_rest_download_url + produit.photoPrincipale.url, produit.photoPrincipale.nom);
            } else {
              resolvedProduct.photoPrincipale = new Photo(0, '', '');
            }
            resolve(resolvedProduct);

          }
        )
        .catch(this.handleError);
    });
    return promise;
  }

  public deleteProduit(produit: Produit): Promise<boolean> {

    const ref = produit.ref;
    const url = `${environment.api_url_product}/${ref}`;
    const postResult = this.http.delete(url, httpOptions);

    const promise = new Promise<boolean>((resolve) => {
      postResult
      // On transforme en promise
        .toPromise()
        .then(
          response => {
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
  public addCategorieProduit(produit: Produit, categorie: Categorie): Promise<any> {


    const url = `${environment.api_url_product}`;
    const postResult = this.http.put<Produit>(url, produit, httpOptions);

    // On créer une promesse
    const promise = new Promise<any>((resolve) => {
      postResult
      // On transforme en promesse
        .toPromise()
        .then(
          response => {
            let retour;
            console.log(response);
            if (response['updateProduit'] == undefined) {
              retour = response[0].message;
            } else {
              const categorie = response['updateProduit'];
              retour = new Categorie(categorie.id, categorie.nom, categorie.level, null);
            }
            // On résout notre promesse
            resolve(retour);
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

    const url = `${environment.api_url_product}`;
    const postResult = this.http.delete(url, httpOptions);

    // On créer une promesse
    const promise = new Promise<Produit>((resolve) => {
      postResult
      // On transforme en promesse
        .toPromise()
        .then(
          response => {
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
    const promise = new Promise<any>((resolve) => {
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

  public removePhoto(photo: Photo): Promise<Produit> {
    // On récupère l'objet Observable retourné par la requête post
    const postResult = this.http.post(environment.api_url, {query: 'mutation{deletePhoto(id:' + photo.id + ') }'});
    // On créer une promesse
    const promise = new Promise<Produit>((resolve) => {
      postResult
      // On transforme en promesse
        .toPromise()
        .then(
          response => {
            // On résout notre promesse
            resolve(response['deletePhoto']);
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
  private handleError(error: Response | any) {
    console.error('ApiService::handleError', error);
    return observableThrowError(error);
  }
}



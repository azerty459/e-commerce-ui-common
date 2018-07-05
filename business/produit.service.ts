import {throwError as observableThrowError} from 'rxjs';
import {Observable, ObservableInput, Subject} from 'rxjs/index';
import {Produit} from '../models/Produit';
import {Injectable} from '@angular/core';
import {environment} from '../../src/environments/environment';
import {Pagination} from "../models/Pagination";
import {Categorie} from '../models/Categorie';
import {Photo} from '../models/Photo';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/observable/of';
import {PaginationDataService} from "./data/pagination-data.service";
import {FiltreService} from "./filtre.service";
import {ProduiDataService} from "./data/produitData.service";



/**
 * Business permettant de gérer les requêtes au niveau de l'api pour l'objet produit.
 */

@Injectable()
export class ProduitBusiness {
  constructor(private http: HttpClient, private paginationDataService: PaginationDataService,private filtreService: FiltreService,private produitDataService: ProduiDataService) {

    // Observable mettant à jour l'observable donnant la liste des produits
    this.subject = new Subject<Pagination>();

  }
  public searchedCategorie: number;
  public searchedCategorieObject;
  public searchedText: string;
  public pageNumber: number;
  public nbProduits: number;
  public searchDone = false;
  public subject: Subject<Pagination>;


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
    const promise = new Promise<Produit[]>((resolve) => {
      postResult
      // On transforme en promise
        .toPromise()
        .then(
          response => {
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
   * Va chercher un produit correspondant à la ref indiqué en paramètre
   * On utilise un map pour récupérer un tableau (arrayCategorie) composé des différentes catégories du produit.
   * @param {string} refProduit La référence du produit recherché
   * @returns {Promise<Produit>} Le résultat de la recherche du produit.
   */
  public getProduitByRef(refProduit: String): Promise<any> {
    // On récupère l'objet Observable retourné par la requête post
    const postResult = this.http.post(environment.api_url, {query: '{ produits(ref: "' + refProduit + '") {ref nom description prixHT categories{id nom} photos {id nom url} } }'});
    // On créer une promesse
    const promise = new Promise<any>((resolve) => {
      postResult
      // On transforme en promise
        .toPromise()
        .then(
          response => {
            const produits = response['produits'];
            // On résout notre promesse
            if (response['produits'] === undefined) {
              resolve(response[0].message);
            } else {
              const produit = response['produits'][0];
              const arrayCategorie = produit.categories.map(
                (categorie) => new Categorie(categorie.id, categorie.nom, categorie.level, categorie.chemin)
              );
              const arrayPhoto = produit.photos.map(
                (photo) => new Photo(photo.id, environment.api_rest_download_url + photo.url, photo.nom)
              );
              resolve(new Produit(produit.ref, produit.nom, produit.description, produit.prixHT, arrayCategorie, arrayPhoto));
            }
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
  public getProduitByPaginationSearch(page: number, nombreDeProduit: number, text: string, categorieId: number): Promise<Pagination> {
    if(text != undefined && text !=null){
      this.searchedText = text;
    }else {
      this.searchedText = "";
    }
    if(page === undefined){
      page = 1;
    }

    const postResult = this.http.post<Pagination>(environment.api_url, {

      query: '{ pagination(type: "produit", page: ' + page + ', npp: ' + nombreDeProduit + ', nom: "' + this.searchedText + '", categorie: ' + categorieId +
      ') { pageActuelle pageMin pageMax total produits { ref nom description prixHT photos {url} } } }'

    });

    const promise = new Promise<Pagination> ( (resolve, reject) => {

      postResult.toPromise().then(
        response => {
          const pagination = response['pagination'];

          const array = pagination.produits.map((produit) => {

            const lesPhotos = produit.photos.map(
              (photo) => new Photo(photo.id, environment.api_rest_download_url + photo.url, photo.url)
            );

            // Ajout des photos du produit
            const prod = new Produit(produit.ref, produit.nom, produit.description, produit.prixHT);
            prod.arrayPhoto = lesPhotos;

            return prod;
          } );
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
  public async search(text: string, idCategorie:number) {
    const result = await this.getProduitByPaginationSearch(this.pageNumber, this.filtreService.getNbProduitParPage(), text, idCategorie);
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
  public  getSearchedCategorie() {
    const categorieNode = this.searchedCategorieObject;
    // 0 équivaut aucune catégorie existante
    if(categorieNode && categorieNode.id !== 0){
      this.filtreService.categorieForBreadCrum  = new Categorie(categorieNode.id,categorieNode.nomCategorie,undefined,undefined);
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
  public getProduitByPagination(page: number, nombreDeProduit: number): Promise<Pagination> {

    // Stockage des valeurs de la pagination
    this.pageNumber = page;
    this.nbProduits = nombreDeProduit;

    const postResult = this.http.post(environment.api_url, {
      query: '{ pagination(type: "produit", page: ' + page + ', npp: ' + nombreDeProduit +
      ') { pageActuelle pageMin pageMax total produits { ref nom description prixHT photos { url } } } }'
    });

    // On créer une promesse
    const promise = new Promise<Pagination>((resolve) => {
      postResult
      // On transforme en promise
        .toPromise()
        .then(
          response => {
            const pagination = response['pagination'];

            const array = pagination.produits.map((produit) => {

              const lesPhotos = produit.photos.map(
                (photo) => new Photo(photo.id, environment.api_rest_download_url + photo.url, photo.url)
              );

              // Ajout des photos du produit
              const prod = new Produit(produit.ref, produit.nom, produit.description, produit.prixHT);
              prod.arrayPhoto = lesPhotos;

              return prod;
            } );
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
    const promise = new Promise<any>((resolve) => {
      postResult
      // On transforme en promise
        .toPromise()
        .then(
          response => {
            if (response['addProduit'] === undefined) {
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

  public updateProduit(produit: Produit): Promise<any> {
    // On récupère l'objet Observable retourné par la requête post

    let requete = 'mutation{updateProduit(produit: { ' +
      'referenceProduit: "' + produit.ref + '", ' +
      'nom: "' + produit.nom + '", ' +
      'description: "' + produit.description + '", ' +
      'prixHT: ' + produit.prixHT + ', ' +
      'categories:[ ';

    for( let categorie of produit.arrayCategorie) {
      requete += '{ idCategorie: ' + categorie.id + ', nomCategorie:"' + categorie.nomCat + '"},';
    }

    requete += '],' +
      '})' +
      '{ref nom description prixHT categories{id nom} photos {id url} }' +
      '}';
    console.log(requete);
    const postResult = this.http.post(environment.api_url, {
      query: requete
    });
    // On créer une promesse
    const promise = new Promise<any>((resolve) => {
      postResult
      // On transforme en promise
        .toPromise()
        .then(
          response => {
            if (response['updateProduit'] === undefined) {
              resolve(response);
            } else {
              const produit = response['updateProduit'];
              const arrayCategorie = produit.categories.map(
                (categorie) => new Categorie(categorie.id, categorie.nom, categorie.level, categorie.chemin)
              );
              const arrayPhoto = produit.photos.map(
                (photo) => new Photo(photo.id, environment.api_rest_download_url + photo.url, photo.url)
              );
              resolve(new Produit(produit.ref, produit.nom, produit.description, produit.prixHT, arrayCategorie, arrayPhoto));
            }
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
    // On récupère l'objet Observable retourné par la requête post
    const postResult = this.http.post(environment.api_url, {
      query: 'mutation{updateProduit(ref:"' + produit.ref + '",nouvelleCat: ' + categorie.id +
      '){ref nom description prixHT categories{id nom} photos {url} }}'
    });
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
    // On récupère l'objet Observable retourné par la requête post
    const postResult = this.http.post(environment.api_url, {query: 'mutation{updateProduit(ref:"' + produit.ref + '",supprimerCat:' + categorie.id + ') {ref nom description prixHT categories{id nom} photos {url} } }'});
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
}



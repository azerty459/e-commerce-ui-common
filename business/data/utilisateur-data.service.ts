import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../src/environments/environment';
import {throwError as observableThrowError} from 'rxjs/index';
import {Produit} from '../../models/Produit';
import {Utilisateur} from '../../models/Utilisateur';
import {Role} from '../../models/Role';

/**
 * Business permettant de gérer les requêtes au niveau de l'api pour l'objet produit.
 */


@Injectable({
  providedIn: 'root'
})
export class UtilisateurDataService {

  constructor(private http: HttpClient) {
  }

  public getUtilisateurById(id: number): Promise<any> {
    // On récupère l'objet Observable retourné par la requête post
    const postResult = this.http.post(environment.api_url, {query: '{ utilisateurs(id: ' + id + ') { id email prenom nom role { nom } } }'});
    // On créer une promesse
    const promise = new Promise<any>((resolve) => {
      postResult
      // On transforme en promise
        .toPromise()
        .then(
          response => {
            const produits = response['utilisateurs'];
            // On résout notre promesse
            if (response['utilisateurs'] === undefined) {
              resolve(response[0].message);
            } else {
              console.log(response);
              const utilisateur = response['utilisateurs'][0];
              const user = new Utilisateur(utilisateur.id, utilisateur.email, utilisateur.prenom, utilisateur.nom,
                '');
              if (utilisateur.role !== null) {
                user.role = utilisateur.role;
              } else {
                user.role = new Role(0, '');
              }
              resolve(user);
            }
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
  public addUtilisateur(utilisateur: Utilisateur): Promise<any> {
    // On récupère l'objet Observable retourné par la requête post
    if (utilisateur.prenom == null) {
      utilisateur.prenom = '';
    }

    if (utilisateur.nom == null) {
      utilisateur.nom = '';
    }

    let requete = 'mutation{addUtilisateur(utilisateur: { ' +
      'email: "' + utilisateur.email + '", ' +
      'mdp: "' + utilisateur.mdp + '", ' +
      'role: {nom:"' + utilisateur.role.nom + '"}})' +
      '{ id nom prenom email role{id nom} }' +
      '}';
    console.log(requete);
    const postResult = this.http.post(environment.api_url, {query: requete});
    // On créer une promesse
    const promise = new Promise<any>((resolve) => {
      postResult
      // On transforme en promise
        .toPromise()
        .then(
          response => {
            console.log(response);
            if (response['addUtilisateur'] === undefined) {
              resolve(response[0].message);
            } else {
              const retourUtilisateur = response['addUtilisateur'];
              const arrayRole = retourUtilisateur.role.map(
                (role) => new Role(role.id, role.nom)
              );
              const user = new Utilisateur(retourUtilisateur.id, retourUtilisateur.email, retourUtilisateur.prenom,
                retourUtilisateur.nom, retourUtilisateur.mdp);
              user.role = new Role(0, '');
              resolve(user);
            }
          }
        )
        .catch(this.handleError);
    });
    return promise;
  }

  public updateUtilisateur(utilisateur: Utilisateur): Promise<any> {
    // On récupère l'objet Observable retourné par la requête post

    console.log(utilisateur);
    let requete = 'mutation{updateUtilisateur(utilisateur: { ' +
      'id: ' + utilisateur.id + ', ' +
      'email: "' + utilisateur.email + '", ' +
      'mdp: "' + utilisateur.mdp + '", ' +
      'prenom: "' + utilisateur.prenom + '", ' +
      'nom: "' + utilisateur.nom + '", ' +
      'role: {nom: "' + utilisateur.role.nom + '", id: ' + utilisateur.role.id + '}';
    requete += '})' +
      '{ id nom prenom email role{id nom} }' +
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
            if (response['updateUtilisateur'] === undefined) {
              resolve(response);
            } else {
              const retourUtilisateur = response['updateUtilisateur'];
              const arrayRole = retourUtilisateur.role.map(
                (role) => new Role(role.id, role.nom)
              );

              const user = new Utilisateur(retourUtilisateur.id, retourUtilisateur.email, retourUtilisateur.prenom,
                retourUtilisateur.nom, retourUtilisateur.mdp);
              user.role = new Role(0, '');
              resolve(user);
            }
          }
        )
        .catch(this.handleError);
    });
    return promise;
  }

  public deleteUtilisateur(utilisateur: Utilisateur): Promise<boolean> {
    // On récupère l'objet Observable retourné par la requête post
    const postResult = this.http.post(environment.api_url, {query: 'mutation{deleteUtilisateur(email: "' + utilisateur.email + '")}'});
    // On créer une promesse
    const promise = new Promise<boolean>((resolve) => {
      postResult
      // On transforme en promise
        .toPromise()
        .then(
          response => {
            resolve(response['deleteUtilisateur']);
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

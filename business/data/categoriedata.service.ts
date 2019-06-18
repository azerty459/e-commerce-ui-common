import {Injectable} from '@angular/core';
import {Categorie} from '../../models/Categorie';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../src/environments/environment';
import {throwError as observableThrowError} from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class CategoriedataService {
  public idLastDeletedCategorie: number;

  constructor(private http: HttpClient) {
  }

  /**
   * Prend une catégorie en paramètre et retourne la même mais avec le champs "chemin" renseigné
   * @param {Categorie} cat la catégorie dont on cherche le chemin
   * @returns {Promise<any>} Une promesse de la catégorie avec le chemin renseigné
   */
  public getChemin(): Promise<any> {

    // Récupérer toutes les catégories
    const url = `${environment.api_url_categorie}/all`;
    const postResult = this.http.get<any>(url);

    // fabrication de la promesse
    const promise = new Promise<any>((resolve, reject) => {

      postResult.toPromise().then((response) => {
          const categories = response;
          // De la réponse de post, on ne garde que la partie "categories" et on mappe chacun de ces objets en objet Categorie
          if (categories !== undefined) {
            // On résout notre promesse
            resolve(categories.map((cat) => new Categorie(cat.id, cat.nom, cat.level, cat.chemin)));
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

    const url = `${environment.api_url_categorie}/idADeplacer/${categorieParent.id}/idNouveauParent/${categorieEnfant.id}`;
    const postResult = this.http.put<any>(url, httpOptions);
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
        );
    });
    return promise;
  }

  /**
   * Methode permettant l'envoi de la requéte afin de restaurer la dernière catégorie supprimée
   * @returns {Promise<any>} true si succès false si echec
   */
  public async restoreLastDeletedCategorie(): Promise<any> {
    if (this.idLastDeletedCategorie === undefined) {
      this.idLastDeletedCategorie = 0;
    }
    // On récupère l'objet Observable retourné par la requête post
    // const postResult = this.http.post(environment.api_url, {
    //   query: 'mutation { restoreCategorie(idNouveauParent:' + this.idLastDeletedCategorie + '){id profondeur}}'
    // });
    const url = `${environment.api_url_categorie}/lastIdCategorieDeleted/${this.idLastDeletedCategorie}`;
    const postResult = this.http.put(url, httpOptions);
    const promise = new Promise<any>((resolve) => {
      postResult
      // On transforme en promise
        .toPromise()
        .then(
          response => {
            // On résout notre promesse
            if (response !== undefined) {
              resolve(response[0]);
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
      // remplacer cette méthode par un appel rest et verifier que ca fait toujour le même resultat dans le front
      // -appel rest (url + service back) + faire l'appel rest ici
      // -verifier le resultat avant transformation et après
    }
  }

  private handleError(error: HttpErrorResponse | any) {
    console.error('Categorie Business::handleError', error);
    return observableThrowError(error);
  }


}

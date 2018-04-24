import { Observable } from 'rxjs/Rx';
import { Produit } from "../models/Produit";
import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {environment} from '../environments/environment'


@Injectable()
export class ProduitBusiness {
  constructor(private http: Http) {}

  private handleError (error: Response | any) {
    console.error('ApiService::handleError', error);
    return Observable.throw(error);
  }

  public getProduit(): Observable<Produit[]> {
    return this.http.post(environment.api_url, { query: '{getAllProduit{ref nom description prixHT}}'})
      .map(response => {
        const produits = response.json().getAllProduit;
        return produits.map((produit) => new Produit(produit.ref, produit.nom, produit.description, produit.prixHT));
      })
      .catch(this.handleError);
  }

  public getProduitByPagination(pageDebut: number, pageFin: number): Observable<Produit[]> {
    return this.http.post(environment.api_url, { query: '{getAllProduit{ref nom description prixHT}}'})
      .map(response => {
        const produits = response.json().getAllProduit;
        produits.map((produit) => new Produit(produit.ref, produit.nom, produit.description, produit.prixHT));
        return produits.slice(pageDebut, pageFin);
      })
      .catch(this.handleError);
  }

  public addProduit(ref: String, nom: String, description: String, prixHT: number): Observable<Produit> {
    return this.http.post(environment.api_url, { query: 'mutation{addProduit(ref: "'+ref+'", nom: "'+nom+'", description: "'+description+'", prixHT: '+prixHT+') { ref nom description prixHT}}'})
      .map(response => {
        const produit = response.json().addProduit;
        return new Produit(produit.ref, produit.nom, produit.description, produit.prixHT);
      })
      .catch(this.handleError);
  }

  public updateProduit(ref: String, nom: String, description: String, prixHT: number): Observable<Produit> {
    return this.http.post(environment.api_url, { query: 'mutation{updateProduit(ref: "'+ref+'", nom: "'+nom+'", description: "'+description+'", prixHT: '+prixHT+') { ref nom description prixHT}}'})
      .map(response => {
        console.log(response.json().updateProduit);
        const produit = response.json().updateProduit;
        return new Produit(produit.ref, produit.nom, produit.description, produit.prixHT);
      })
      .catch(this.handleError);
  }

  public deleteProduit(ref: String): Observable<Boolean>{
    console.log('mutation{deleteProduit(ref: "'+ref+'")}');
    return this.http.post(environment.api_url, { query: 'mutation{deleteProduit(ref: "'+ref+'")}'})
      .map(response => {
        console.log(response.json());
        return response.json().deleteProduit;
      })
      .catch(this.handleError);
  }
}

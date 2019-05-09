import {Injectable} from '@angular/core';
import {Categorie} from '../models/Categorie';

@Injectable()
export class FiltreService {
  public pageAffiche: number;
  public categorieForBreadCrum: Categorie = null;
  public produits;
  private DEFAULT_PRODUIT_PAR_PAGE = 5;

  constructor() {
  }

  public saveNbProduitParPage(produitParPage: number) {
    localStorage.setItem('filtreNbProduitParPage', '' + produitParPage);
  }

  public getNbProduitParPage() {
    const produitParPage = localStorage.getItem('filtreNbProduitParPage');
    if (produitParPage === undefined || produitParPage === null) {
      return this.DEFAULT_PRODUIT_PAR_PAGE;
    } else {
      return parseInt(produitParPage);
    }
  }

  public setFiltres(produits, lengthProduit, pageActuelURL, pageMax) {
    this.produits = produits;

  }

}

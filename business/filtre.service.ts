import {Injectable} from '@angular/core';
import {Categorie} from '../models/Categorie';

@Injectable()
export class FiltreService {
  public pageAffiche: number;
  public categorieForBreadCrum: Categorie = null;
  public produits;
  private DEFAULT_PRODUIT_PAR_PAGE = 5;
  private DEFAULT_NAME_OF_TRI = 'Nom';

  constructor() {
  }

  public saveNbProduitParPage(produitParPage: number) {
    localStorage.setItem('filtreNbProduitParPage', '' + produitParPage);
  }

  public saveNameOfTri(nameOfTri: string) {
    localStorage.setItem('filtreNameOfTri', '' + nameOfTri);
  }

  public getNbProduitParPage() {
    const produitParPage = localStorage.getItem('filtreNbProduitParPage');
    if (produitParPage === undefined || produitParPage === null) {
      return this.DEFAULT_PRODUIT_PAR_PAGE;
    } else {
      return parseInt(produitParPage);
    }
  }

  public getNameOfTri() {
    const nameOfTri = localStorage.getItem('filtreNameOfTri');
    if (nameOfTri === undefined || nameOfTri === null) {
      return this.DEFAULT_NAME_OF_TRI;
    } else {
      return nameOfTri;
    }
  }

  public setFiltres(produits, lengthProduit, pageActuelURL, pageMax) {
    this.produits = produits;

  }

}

import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Injectable()
export class FiltreService {
  private DEFAULT_PRODUIT_PAR_PAGE = 5;
  public pageAffiche:number;
  public categorieForBreadCrum;
  public produits;
  public lengthProduit;
  public pageActuelURL;
  public pageMax;
  constructor() {
  }
  public saveNbProduitParPage(produitParPage: number){
    sessionStorage.setItem("filtreNbProduitParPage", ""+produitParPage)
  }
  public getNbProduitParPage(){
    const produitParPage = sessionStorage.getItem("filtreNbProduitParPage");
    if (produitParPage === undefined || produitParPage === null){
      return this.DEFAULT_PRODUIT_PAR_PAGE;
    }else {
      return parseInt(produitParPage);
    }
  }
  public setFiltres(produits,lengthProduit,pageActuelURL,pageMax){
    this.produits = produits;
    this.lengthProduit = lengthProduit;
    this.pageActuelURL = pageActuelURL;
    this.pageMax = pageMax;
  }

}

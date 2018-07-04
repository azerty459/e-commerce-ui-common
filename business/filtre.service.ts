import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import {Categorie} from "../models/Categorie";

@Injectable()
export class FiltreService {
  private DEFAULT_PRODUIT_PAR_PAGE = 5;
  public pageAffiche:number;
  public categorieForBreadCrum : Categorie = null;
  public produits;
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

  }

}

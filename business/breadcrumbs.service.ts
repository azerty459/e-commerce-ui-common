import { Injectable } from '@angular/core';
import { Produit} from '../models/Produit';
import {Categorie} from '../models/Categorie';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbsService {

  constructor() { }

  /**
   * Prend toutes les catégories d'un produit et renvoie celle avec l'id la plus petite
   * @param {Produit} produit le produit dont on examine les catégories
   * @returns {Categorie} la catégorie avec l'id la plus petite
   */
  getBreadCrumb(produit: Produit): Categorie {

    // Récupérer la liste des catégories à laquelle le produit appartient
    const listecategories = produit.arrayCategorie;

    // Si le produit n'a pas de catégories
    if(listecategories.length === 0) {
      return undefined;
    }

    // La trier selon l'id de catégorie: on prendra la catégorie d'id la plus petite à chaque fois.
    let cat = listecategories[0];
    let idmin = cat.id;
    listecategories.forEach((c) => {
        if(c.id < idmin) {
          cat = c;
          idmin = c.id;
        }
    });

    return cat;
  }
}

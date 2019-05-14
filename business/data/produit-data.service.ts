import {Injectable} from '@angular/core';
import {Produits} from '../../models/Produits';


@Injectable()

export class ProduiDataService {
  /**
   * Tableau de produits à afficher
   */
  public produits: Produits = new Produits([], 0);
  /**
   * Taille du tableau de produits à afficher
   */
  public lengthProduit;

  constructor() {
  }

}


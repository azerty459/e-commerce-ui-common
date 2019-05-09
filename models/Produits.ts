import {Produit} from "./Produit";

export class Produits {
  constructor(
    public arrayProduit = new Array<Produit>(),
    public length = 0
  ) {
  }

}

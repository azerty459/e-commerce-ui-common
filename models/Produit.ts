import {Categorie} from "./Categorie";

export class Produit {
  constructor(
    public ref: string,
    public nom: string,
    public description: string,
    public prixHT: number,
    public arrayCategorie= [Categorie]
  ) {}
}

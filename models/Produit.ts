import {Categorie} from "./Categorie";
import {Photo} from "./Photo";
export class Produit {
  constructor(
    public ref: string,
    public nom: string,
    public description: string,
    public prixHT: number,
    public arrayCategorie= [Categorie],
    public arrayPhoto= [Photo]
  ) {}
}

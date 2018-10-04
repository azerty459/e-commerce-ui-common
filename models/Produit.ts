import {Categorie} from "./Categorie";
import {Photo} from "./Photo";
import {Avis} from "./Avis";
export class Produit {
  constructor(
    public ref: string,
    public nom: string,
    public description: string,
    public prixHT: number,
    public arrayCategorie = new Array<Categorie>(),
    public arrayPhoto = new Array<Photo>(),
    public photoPrincipale = new Photo(0, '', ''),
    public mapCaracteristique = new Map<String, String>()
  ) {}
  public avis: [Avis];
}

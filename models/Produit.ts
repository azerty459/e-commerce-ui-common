import {Categorie} from './Categorie';
import {Photo} from './Photo';
import {Avis} from './Avis';

export class Produit {
  public avis: [Avis];

  constructor(
    public ref: string,
    public nom: string,
    public description: string,
    public prixHT: number,
    public noteMoyenne: number,
    public arrayCategorie = new Array<Categorie>(),
    public arrayPhoto = new Array<Photo>(),
    public photoPrincipale = new Photo(0, '', '')
  ) {
  }
}

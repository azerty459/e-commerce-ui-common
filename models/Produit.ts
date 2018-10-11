import {Caracteristique} from './Caracteristique';
import {environment} from '../../src/environments/environment';
import {Categorie} from './Categorie';
import {Photo} from './Photo';
export class Produit {

  // public avis: [Avis];
  public ref: string;
  public nom: string;
  public description: string;
  public prixHT: number;
  public arrayCategorie: Categorie[] = [];
  public arrayPhoto: Photo[] = [];
  public photoPrincipale = new Photo(0, '', '');
  public mapCaracteristique = new Map<Caracteristique, String>();

  constructor() {}

  /**
   * Map un objet Produit reçu d'une réponse à une requête en objet Typescript (uniquement pour les attributs
   * ref, nom, description et prixHT)
   * @param jsonObject
   */
  public static oneIncompleteFromJson(jsonObject: any): Produit {
    const result: Produit = new Produit();
    result.ref = jsonObject.ref;
    result.nom = jsonObject.nom;
    result.description = jsonObject.description;
    result.prixHT = jsonObject.prixHT;
    return result;
  }

  /**
   * Map un objet Produit reçu d'une réponse à une requête en objet Typescript
   * @param jsonObject
   */
  public static oneCompleteFromJson(jsonObject: any): Produit {
    const result = Produit.oneIncompleteFromJson(jsonObject);

    // TODO fonctions FromJson à faire pour les autres objets + les appliquer ici
    result.arrayCategorie = jsonObject.categories.map(
      (categorie) => new Categorie(categorie.id, categorie.nom, categorie.level, categorie.chemin)
    );
    // TODO décommenter pour créer les caractéristiques associées aux produits
    // result.mapCaracteristique = Produit.createMapCaracteristique(jsonObject.caracteristiques);
    result.arrayPhoto = jsonObject.photos.map(
      (photo) => new Photo(photo.id, environment.api_rest_download_url + photo.url, photo.nom)
    );
    if (jsonObject.photoPrincipale != null && jsonObject.photoPrincipale !== undefined) {
      result.photoPrincipale = new Photo(
        jsonObject.photoPrincipale.id, environment.api_rest_download_url + jsonObject.photoPrincipale.url, jsonObject.photoPrincipale.nom
      );
    }
    // fin TODO

    return result;
  }

  /**
   * Map l'attribut mapCaracteristique de l'objet Produit en Map Typescript
   * @param jsonObjectCaracteristiques
   */
  private static createMapCaracteristique(jsonObjectCaracteristiques: any): Map<Caracteristique, String> {
    const mapCaracteristique: Map<Caracteristique, String> = new Map<Caracteristique, String>();
    jsonObjectCaracteristiques.map(
      caracJson => {
        const carac: Caracteristique = Caracteristique.oneFromJson(caracJson);
        const value: string = caracJson.value;
        mapCaracteristique.set(carac, value);
      }
    );
    return mapCaracteristique;
  }

}



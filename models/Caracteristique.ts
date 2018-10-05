/**
 * Objet caractéristique d'un produit.
 *
 * Contient un libellé et une valeur
 */

export class Caracteristique {
  id: number;
  label: string;

  public static fromJson(json: Object): Caracteristique {
    const result: Caracteristique = new Caracteristique();
    result.id = json['id'];
    result.label = json['label'];
    return result;
  }
}


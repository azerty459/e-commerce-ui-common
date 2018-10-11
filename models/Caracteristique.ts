/**
 * Objet caractéristique d'un produit.
 *
 * Contient un libellé et une valeur
 */

export class Caracteristique {
  id: number;
  label: string;

  /**
   * Map un objet Caracteristique reçu d'une réponse à une requête en objet Typescript
   * @param jsonObject
   */
  public static oneFromJson(jsonObject: Object): Caracteristique {
    const result: Caracteristique = new Caracteristique();
    result.id = jsonObject['id'];
    result.label = jsonObject['label'];
    return result;
  }

  /**
   * Map une liste d'objet Caracteristique reçu d'une réponse à une requête en objet Typescript
   * @param jsonObject
   */
  public static manyFromJson(jsonObject: Object): Caracteristique[] {
    const result: Caracteristique[] = [];
    jsonObject['caracteristiques'].map(
      caracJson => result.push(Caracteristique.oneFromJson(caracJson))
    );
    return result;
  }
}


/**Donnée d'une cellule de l'arbre des catégories
 * Chaque cellule possède un nomCategorie et une liste d'enfant
 * Un id correspondant à l'id de la categorie
 */
export class CategorieNode {
  children: CategorieNode[];
  nomCategorie: string;
  id: any;
}

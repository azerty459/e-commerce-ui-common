/**
 * CategorieNode avec l'information sur le niveau et si il est extensible
 * isInEditMode : true si la node est en mode modification sinon false
 * enableToolNode : true si les outils attaché à la node sont visible
 */
export class CategorieFlatNode {
  nomCategorie: string;
  nomCategorieModifie: string;
  idParent: number;
  id: any;
  level: number;
  expandable: boolean;
  enableToolNode: boolean = false;
  isInEditMode: boolean = false;
}



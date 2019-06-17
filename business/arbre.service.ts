import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of as observableOf} from 'rxjs/index';
import {CategorieNode} from '../models/CategorieNode';
import {CategorieBusinessService} from './categorie.service';
import {CategorieFlatNode} from '../models/CategorieFlatNode';
import {CategoriedataService} from './data/categoriedata.service';

/**
 * Service gérant les arbres. Il peut construire un arbre à partir d'un objet json strucuté.
 * Il permet le passage d'une node classique à une flat node contenant l'information sur le niveau notament.
 */
@Injectable()

export class ArbreService {
  /**
   * vrai si l'arbre possède des categories, false sinon
   * @type {boolean}
   */
  hasCategories = true;
  lastDeletedNode: CategorieNode;
  lastDeletedParentnode: CategorieNode;
  dataChange: BehaviorSubject<CategorieNode[]> = new BehaviorSubject<CategorieNode[]>([]);
  /** Map de flat node vers nested node, elle nous permet de touver la nested node a modifier*/
  flatNodeMap: Map<CategorieFlatNode, CategorieNode> = new Map<CategorieFlatNode, CategorieNode>();
  /** Map de nested node vers flat node, elle nous permet de touver la flat node a modifier*/
  nestedNodeMap: Map<CategorieNode, CategorieFlatNode> = new Map<CategorieNode, CategorieFlatNode>();

  constructor(public categorieBusiness: CategorieBusinessService, public categoriedataBusiness: CategoriedataService) {
    this.initialize();
  }

  /**
   * Permet d'obtenir les données de l'arbre
   * @returns {CategorieNode[]}
   */
  get data(): CategorieNode[] {
    this.sortNodes(this.dataChange.value);
    return this.dataChange.value;
  }

  /**
   * Transforme une Node en FlatNode, rajoute l'information du niveau et de la capacité de la node a s'étendre ou non
   * @param {CategorieNode} node à transformer
   * @param {number} level niveau de la node dans l'arbre
   * @return {CategorieFlatNode} FlatNode prête à être utilisé pour générer l'arbre
   */
  transformerNodeToFlatNode = (node: CategorieNode, level: number) => {
    const nomCatNotUndefined = node.nomCategorie !== undefined;
    const nestedNodeMapHasNode = this.nestedNodeMap.has(node);
    let nodeAlreadyExist;
    if (this.nestedNodeMap.get(node) !== undefined) {
      nodeAlreadyExist = this.nestedNodeMap.get(node).nomCategorie === node.nomCategorie;
    } else {
      nodeAlreadyExist = false;
    }

    const flatNode = nomCatNotUndefined && nestedNodeMapHasNode && nodeAlreadyExist
      ? this.nestedNodeMap.get(node)!
      : new CategorieFlatNode();

    flatNode.nomCategorie = node.nomCategorie;
    flatNode.id = node.id;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    flatNode.nomCategorieModifie = flatNode.nomCategorie;
    flatNode.idParent = node.idParent;
    flatNode.enableToolNode = false;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;

  };

  /**
   * Permet d'obtenir le niveau d'un CategorieFlatNode
   * @return {number} le niveau
   * @param node la node concerné
   */
  public getLevel = (node: CategorieFlatNode) => {
    return node.level;
  };

  /**
   * Permet de savoir si un FlatNode est extensible
   * @param {CategorieFlatNode} node
   * @return {boolean} true si extensible false sinon
   */
  public isExpandable = (node: CategorieFlatNode) => {
    return node.expandable;
  };

  /**
   * Permet d'obtenir les enfants d'une Node
   * @param {CategorieNode} node
   * @return {Observable<CategorieNode[]>} observable permettant d'obtenir une liste de CategorieNode
   * représentant les enfants
   */
  public getChildren = (node: CategorieNode): Observable<CategorieNode[]> => {
    return observableOf(node.children);
  };

  public sortNodes(categorieNodes: CategorieNode[]) {
    this.sortArrayNode(categorieNodes);
    for (const categorie of categorieNodes) {
      if (categorie !== undefined && categorie.children !== undefined) {
        this.sortNodes(categorie.children);
      }
    }
  }

  public sortArrayNode(categorieNodes: CategorieNode[]) {
    for (let ind01 = 0; ind01 < categorieNodes.length; ind01++) {
      for (let ind02 = ind01 + 1; ind02 < categorieNodes.length; ind02++) {
        const nodeNotUndefined = categorieNodes[ind01] !== undefined && categorieNodes[ind02] !== undefined;
        const nomCategorieNotUndefined = categorieNodes[ind01].nomCategorie[0] !== undefined && categorieNodes[ind02].nomCategorie[0] !== undefined;
        if (nodeNotUndefined && nomCategorieNotUndefined && categorieNodes[ind01].nomCategorie[0].toUpperCase() > categorieNodes[ind02].nomCategorie[0].toUpperCase()) {
          const temp = categorieNodes[ind01];
          categorieNodes[ind01] = categorieNodes[ind02];
          categorieNodes[ind02] = temp;
          ind02 = ind02 + 1;
        }
      }

    }
  }

  /**
   * Méthode s'executant à l'initialisation
   * @return {Promise<void>}
   */
  async initialize() {
    const dataObject = await this.categorieBusiness.getTree();
    if (dataObject !== null && dataObject !== undefined) {
      // Construit l'arbre composé de node à partir de l'objet Json. Le resulat est une liste de 'CategorieNode' avec
      // des file node imbriqué en tant qu'enfant
      const data = this.buildFileTree(dataObject, 0);
      this.hasCategories = dataObject !== undefined;
      // Notifie le changement
      this.sortNodes(data);
      this.dataChange.next(data);

    }
  }

  /**
   * Permet de construire la structure de l'arbre
   * @param value objet Json
   * @param {number} level niveau du CategorieNode dans l'arbre
   * @return {CategorieNode[]} liste d'objet CategorieNode qui représente chaque élement(branche ou feuille) de l'arbre.
   */
  buildFileTree(value: any, level: number): CategorieNode[] {
    const data: any[] = [];
    for (const k in value) {
      const values = value[k];
      const node = new CategorieNode();
      node.nomCategorie = values.nom;
      node.id = values.id;
      // On test l'objet pour savoir si il possède des sous categories
      if (values.sousCategories === null || values.sousCategories === undefined || values.sousCategories[0] === undefined) {
        // L'objet ne possède pas de sous categories c'est une feuille de l'arbre

      } else {
        // L'objet possède des sous catégories c'est une branche de l'arbre
        // On rappelle donc en récursif la méthode
        node.children = this.buildFileTree(values.sousCategories, level + 1);
      }
      for (const i in node.children) {
        node.children[i].idParent = node.id;
      }
      data.push(node);
    }
    return data;
  }

  // buildFileTree(value: any, level: number): CategorieNode[] {
  //   const data: any[] = [];
  //
  //   for (const k in value) {
  //     const values = value[k];
  //     console.log(values);
  //     const node = new CategorieNode();
  //     node.nomCategorie = values.nom;
  //     node.id = values.id;
  //     // On test l'objet pour savoir si il possède des sous categories
  //     if (values.sousCategories === null || values.sousCategories === undefined || values.sousCategories[0] === undefined) {
  //       // L'objet ne possède pas de sous categories c'est une feuille de l'arbre
  //
  //     } else {
  //       // L'objet possède des sous catégories c'est une branche de l'arbre
  //       // On rappelle donc en récursif la méthode
  //       node.children = this.buildFileTree(values.sousCategories, level + 1);
  //     }
  //     for (const i in node.children) {
  //       node.children[i].idParent = node.id;
  //     }
  //     data.push(node);
  //   }
  //   return data;
  // }

  /**
   * Methode permettant de supprimer visuelement une sous categorie
   * @param {CategorieNode} nodeParent la node parent qui contient l'enfant a supprimer
   * @param {CategorieNode} nodeToDelete la node a supprimer
   */
  public deleteChild(nodeParent: CategorieNode, nodeToDelete: CategorieNode) {
    for (const i in nodeParent.children) {
      if (nodeParent.children[i].id === nodeToDelete.id) {
        nodeParent.children.splice(parseInt(i, 10), 1);
      }
    }
    if (nodeParent.children.length === 0) {
      nodeParent.children = undefined;
    }
    this.dataChange.next(this.data);
  }

  /** Ajoute une nouvelle categorie vide à l'arbre
   * @param {CategorieNode} parent le parent de la catégorie à inserer
   * @param {string} nodeToInsert la node a inserer
   */
  insertItem(parent: CategorieNode, nodeToInsert: CategorieNode) {
    // un parent null signifie qu'on souhaite une categorie de level 0
    if (parent === null || parent === undefined) {
      this.data.push(nodeToInsert);
      this.dataChange.next(this.data);
    } else {
      nodeToInsert.idParent = parent.id;
      const child = nodeToInsert;
      if (parent.children === undefined) {
        parent.children = new Array<CategorieNode>();
      }
      parent.children.push(child);
      this.sortNodes(this.data);
      this.dataChange.next(this.data);
    }
    if (!this.hasCategories) {
      this.hasCategories = true;
    }

  }

  /**
   * Met a jour une categorie de l'arbre
   * @param {CategorieNode} node a mettre a jour
   * @param {string} nomCategorie nom de la categorie a associer
   */
  updateCategorie(node: CategorieNode, nomCategorie: string) {
    node.nomCategorie = nomCategorie;
    this.dataChange.next(this.data);
  }

  /**
   * Permet de vérifier si node contient nodeParent
   * @param {CategorieNode} node la node qui est vérifié
   * @param {CategorieNode} nodeParent la nodeParent qu'on cherche dans node
   * @returns {boolean} vrai si elle le contient faux sinon
   */
  public nodeContain(node: CategorieNode, nodeParent: CategorieNode) {
    if (node.children !== undefined) {
      for (const index in node.children) {
        console.log(node.children[index]);
        if (node.children[index].id === nodeParent.id) {
          console.log('return true');

          return true;
        }
        if (node.children[index].children !== undefined && nodeParent !== undefined) {
          const childNotContainNode = !this.nodeContain(node.children[index], nodeParent);
          if (childNotContainNode === false) {
            return true;
          }
        }
      }
    }
    return false;
  }

  /**
   * Methode permettant la restauration de la dernière node supprimé
   */
  public async restoreLastDeletedNode() {
    const response = await this.categoriedataBusiness.restoreLastDeletedCategorie();
    console.log(this.lastDeletedParentnode);
    this.insertItem(this.lastDeletedParentnode, this.buildFileTree(response.categories, 0)[0]);
  }
}


import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/index';
import {CategorieNode} from "../models/CategorieNode";
import {CategorieBusinessService} from "./categorie.service";
import {CategorieFlatNode} from "../models/CategorieFlatNode";
import {Observable, of as observableOf} from "rxjs/index";

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
  hasCategories : boolean=true;
  dataChange: BehaviorSubject<CategorieNode[]> = new BehaviorSubject<CategorieNode[]>([]);
  /** Map de flat node vers nested node, elle nous permet de touver la nested node a modifier*/
  flatNodeMap: Map<CategorieFlatNode, CategorieNode> = new Map<CategorieFlatNode, CategorieNode>();
  /** Map de nested node vers flat node, elle nous permet de touver la flat node a modifier*/
  nestedNodeMap: Map<CategorieNode, CategorieFlatNode> = new Map<CategorieNode, CategorieFlatNode>();
  /**
   * Transforme une Node en FlatNode, rajoute l'information du niveau et de la capacité de la node a s'étendre ou non
   * @param {CategorieNode} node à transformer
   * @param {number} level niveau de la node dans l'arbre
   * @return {CategorieFlatNode} FlatNode prête à être utilisé pour générer l'arbre
   */
  transformerNodeToFlatNode = (node: CategorieNode, level: number) => {
    let flatNode = node.nomCategorie != undefined && this.nestedNodeMap.has(node) && this.nestedNodeMap.get(node)!.nomCategorie === node.nomCategorie
      ? this.nestedNodeMap.get(node)!
      : new CategorieFlatNode();
    flatNode.nomCategorie = node.nomCategorie;
    flatNode.id = node.id;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    flatNode.nomCategorieModifie = flatNode.nomCategorie;
    flatNode.idParent = node.idParent;

    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;

  };
  /**
   * Permet d'obtenir le niveau d'un CategorieFlatNode
   * @param {CategorieFlatNode} Flat Node
   * @return {number} le niveau
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

  constructor(public categorieBusiness: CategorieBusinessService) {
    this.initialize();
  }

  get data(): CategorieNode[] {
    return this.dataChange.value;
  }

  /**
   * Méthode s'executant à l'initialisation
   * @return {Promise<void>}
   */
  async initialize() {
    const dataObject = await this.categorieBusiness.getTree();
    if(dataObject!=null){
      // Construit l'arbre composé de node à partir de l'objet Json. Le resulat est une liste de 'CategorieNode' avec
      // des file node imbriqué en tant qu'enfant
      const data = this.buildFileTree(dataObject.categories, 0);
      // Notifie le changement
      this.dataChange.next(data);
      this.hasCategories=true;
    }else {
      this.hasCategories=false;
    }

    }
  /**
   * Permet de construire la structure de l'arbre
   * @param value objet Json
   * @param {number} level niveau du CategorieNode dans l'arbre
   * @return {CategorieNode[]} liste d'objet CategorieNode qui représente chaque élement(branche ou feuille) de l'arbre.
   */
  buildFileTree(value: any, level: number): CategorieNode[] {
    let data: any[] = [];

    for (let k in value) {
      let values = value[k];
      let node = new CategorieNode();
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
      for (let i in node.children) {
        node.children[i].idParent = node.id;
      }
      data.push(node);
    }
    return data;
  }

  /**
   * Methode permettant de supprimer visuelement une sous categorie
   * @param {CategorieNode} nodeParent la node parent qui contient l'enfant a supprimer
   * @param {CategorieNode} nodeToDelete la node a supprimer
   */
  public deleteChild(nodeParent: CategorieNode, nodeToDelete:CategorieNode) {
    for(let i in nodeParent.children){
      if(nodeParent.children[i].id == nodeToDelete.id){
        nodeParent.children.splice(parseInt(i),1);
      }
    }
    if(nodeParent.children.length === 0 ){
      nodeParent.children=undefined;
    }
    this.dataChange.next(this.data);
  }


}

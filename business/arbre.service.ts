import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {CategorieNode} from "../models/CategorieNode";
import {CategorieBusinessService} from "./categorie.service";
import {CategorieFlatNode} from "../models/CategorieFlatNode";
import {Observable,of as observableOf} from "rxjs/index";




/**
 * Service gérant les arbres. Il peut construire un arbre à partir d'un objet json strucuté.
 * Il permet le passage d'une node classique à une flat node contenant l'information sur le niveau notament.
 */
@Injectable()
export class ArbreService {
  dataChange: BehaviorSubject<CategorieNode[]> = new BehaviorSubject<CategorieNode[]>([]);

  get data(): CategorieNode[] { return this.dataChange.value; }

  constructor(public categorieBusiness: CategorieBusinessService) {
    this.initialize();
  }

  /**
   * Méthode s'executant à l'initialisation
   * @return {Promise<void>}
   */
  async initialize() {
    const dataObject =await this.categorieBusiness.getTree();

    // Construit l'arbre composé de node à partir de l'objet Json. Le resulat est une liste de 'CategorieNode' avec
    // des file node imbriqué en tant qu'enfant
    const data = this.buildFileTree(dataObject.categories, 0);

    // Notifie le changement
    this.dataChange.next(data);
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
      } else{
        // L'objet possède des sous catégories c'est une branche de l'arbre
        // On rappelle donc en récursif la méthode
        node.children = this.buildFileTree(values.sousCategories, level + 1);
      }
      data.push(node);
    }
    return data;
  }

  /**
   * Transforme une Node en FlatNode, rajoute l'information du niveau et de la capacité de la node a s'étendre ou non
   * @param {CategorieNode} node à transformer
   * @param {number} level niveau de la node dans l'arbre
   * @return {CategorieFlatNode} FlatNode prête à être utilisé pour générer l'arbre
   */
  transformerNodeToFlatNode = (node: CategorieNode, level: number) => {
    let flatNode = new CategorieFlatNode();
    flatNode.nomCategorie = node.nomCategorie;
    flatNode.id = node.id;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    flatNode.nomCategorieModifie = flatNode.nomCategorie;
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


}

export class Categorie {

  constructor(
    public id: number,
    public nomCat: string,
    public level: number,
    public chemin: string
  ) {}

  /**
   * Compare 2 catégories
   * @param {Categorie} cat la catégorie à laquelle on compare.
   * @returns {boolean} true si les 2 catégories ont le même id, false sinon.
   */
  sontIdentiques(cat: Categorie): boolean {
    const id1 = cat.id;
    const id2 = this.id;
    return id1 === id2;
  }

}



export class Statistique {
    constructor(
        public nbProduit: number,
        public nbUtilisateur: number,
        public nbCategorie: number,
        public nbProduitCategorie = new Array<any>()
    ){}
}

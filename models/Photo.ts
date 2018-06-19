
export class Photo {
  constructor(
    public id: number,
    public url: string,
    public urlSimplifie: string // Chemin de la photo relatif au dossier de stockage photo
  ) {}
  public file;
}

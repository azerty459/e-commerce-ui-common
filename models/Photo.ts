
export class Photo {
  constructor(
    /**
     * URL de la photo
     */
    public id: number,
    public url: string,
    /**
     * Nom d'origine du fichier uploadé
     */
    public nom: string
  ) {}
  public file;
  public imgHeight;
  public imgWidth;
}

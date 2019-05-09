export class Photo {
  public file;
  public imgHeight;
  public imgWidth;

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
  ) {
  }
}

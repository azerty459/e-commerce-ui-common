export class Pagination {
  constructor(
    public pageActuelle: number,
    public pageMin: number,
    public pageMax: number,
    public total: number,
    public tableau= [],
  ) {}
}

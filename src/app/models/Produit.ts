import {Component} from "@angular/core";

@Component
export class Produit {
  constructor(
    public ref: string,
    public nom: string,
    public description: string,
    public prixHT: number
  ) {}
}

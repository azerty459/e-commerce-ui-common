import { Component, OnInit } from '@angular/core';
import {ProduitBusiness} from "./business/produit.business";
import {Produit} from "./models/Produit";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-e-commerce-ui-common',
  templateUrl: './e-commerce-ui-common.component.html',
  styleUrls: ['./e-commerce-ui-common.component.css']
})
export class ECommerceUiCommonComponent implements OnInit {

  constructor(private produitBusiness: ProduitBusiness) { }

  ngOnInit() {

  }

  getProduit(): Observable<Produit[]>{
    return this.produitBusiness.getProduit();
  }

}

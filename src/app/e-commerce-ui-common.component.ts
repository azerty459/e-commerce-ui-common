import { Component, OnInit } from '@angular/core';
import {ProduitBusiness} from "./business/produit.business";

@Component({
  selector: 'app-e-commerce-ui-common',
  templateUrl: './e-commerce-ui-common.component.html',
  styleUrls: ['./e-commerce-ui-common.component.css']
})
export class ECommerceUiCommonComponent implements OnInit {

  constructor(private produitBusiness: ProduitBusiness) { }

  ngOnInit() {

  }

  getProduit(){
    this.produitBusiness.getProduit();
  }

}

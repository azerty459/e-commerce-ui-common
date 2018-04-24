import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {ProduitBusiness} from "../app/business/produit.business";
import {Produit} from "../app/models/Produit";
import { ECommerceUiCommonComponent } from './e-commerce-ui-common.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    Produit,
    ECommerceUiCommonComponent
  ],
  providers: [
    ProduitBusiness
  ],
  exports: [ECommerceUiCommonComponent]
})
export class ECommerceUiCommonModule { }

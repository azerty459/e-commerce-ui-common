import { NgModule } from '@angular/core';

import {ProduitBusiness} from "../app/business/produit.business";
import {Produit} from "../app/models/Produit";

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
  ],
  declarations: [
    Produit
  ],
  providers: [ProduitBusiness],
  exports: [AppComponent]
})
export class AppModule { }

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {ProduitBusiness} from "./produit.business";
import {Observable} from "rxjs/Observable";
import {Produit} from "../models/Produit";

describe('ProduitBusinessTest', () => {
  let component: ProduitBusiness;
  let fixture: ComponentFixture<ProduitBusiness>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProduitBusiness ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProduitBusiness);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get getProduit()', () =>{
    const result = component.getProduit();
    expect(result.subscribe(async(value) => expect(value.length).toBeGreaterThan(0)));
  })

  it('should get getProduitByPagination()', () =>{
    const result = component.getProduitByPagination(0, 5);
    expect(result.subscribe(async(value) => expect(value.length).toBeGreaterThan(0)));
  })
});

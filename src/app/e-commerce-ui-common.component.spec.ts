import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ECommerceUiCommonComponent } from './e-commerce-ui-common.component';

describe('ECommerceUiCommonComponent', () => {
  let component: ECommerceUiCommonComponent;
  let fixture: ComponentFixture<ECommerceUiCommonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ECommerceUiCommonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ECommerceUiCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

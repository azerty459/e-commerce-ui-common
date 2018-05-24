import {Component, Input, OnInit} from '@angular/core';
import { Location } from '@angular/common';
import {PreviousRouteBusiness} from "../../business/previous-route.business";
import {Router} from "@angular/router";
@Component({
  selector: 'app-retour',
  templateUrl: './retour.component.html',
  styleUrls: ['./retour.component.css']
})
export class RetourComponent implements OnInit {
  urlPrecedente: string;
  @Input() urlPrecedenteAttendue: string;

  constructor(
    private location: Location,
    private previousRouteBusiness : PreviousRouteBusiness,
    private router: Router
  ) {
  }

  ngOnInit() {
    console.log(this.previousRouteBusiness.getPreviousUrl());
    console.log(this.previousRouteBusiness.getCurrentUrl());
    this.urlPrecedente=this.previousRouteBusiness.getPreviousUrl();
    console.log(this.previousRouteBusiness.getPreviousUrl());
    console.log(this.previousRouteBusiness.getCurrentUrl());
  }



  goBack(): void {
    if(this.urlPrecedente.startsWith(this.urlPrecedenteAttendue)){
      this.router.navigateByUrl(this.previousRouteBusiness.getPreviousUrl()+';back='+'1');
    }
    else{
      this.router.navigate([this.urlPrecedenteAttendue]);
    }
  }

}

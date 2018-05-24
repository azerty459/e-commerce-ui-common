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


  constructor(
    private location: Location,
    private previousRouteBusiness : PreviousRouteBusiness,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.urlPrecedente=this.previousRouteBusiness.getPreviousUrl();
  }



  goBack(): void {
    console.log("go back : url precedente" + this.urlPrecedente)
    if(this.urlPrecedente !== '/'){
      this.router.navigateByUrl(this.previousRouteBusiness.getPreviousUrl()+';back=1');
    }
    else{
      this.router.navigate(['/']);
    }
  }

}

import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Injectable()
export class PreviousRouteBusiness {

  private previousUrl: string;
  private currentUrl: string;
  public retour: boolean = false;
  constructor(private router: Router) {
    this.currentUrl = this.router.url;
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log("previous url ->"+this.currentUrl+" current url ->"+event.url);
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;

      }

    });
  }

  public getPreviousUrl() {
    return this.previousUrl;
  }
  public getCurrentUrl(){
    return this.currentUrl;
  }
  public setCurrentUrl( url: string) {
    this.currentUrl=url;
  }
}

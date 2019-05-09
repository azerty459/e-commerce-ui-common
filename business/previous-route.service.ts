import {Injectable} from "@angular/core";
import {NavigationEnd, Router} from "@angular/router";

@Injectable()
export class PreviousRouteBusiness {

  public retour: boolean = false;
  private previousUrl: string;
  private currentUrl: string;

  constructor(private router: Router) {
    this.currentUrl = this.router.url;
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log("previous url ->" + this.currentUrl + " current url ->" + event.url);
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;

      }

    });
  }

  public getPreviousUrl() {
    return this.previousUrl;
  }

  public getCurrentUrl() {
    return this.currentUrl;
  }

  public setCurrentUrl(url: string) {
    this.currentUrl = url;
  }
}

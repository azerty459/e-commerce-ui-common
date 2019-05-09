import {Injectable} from '@angular/core';
import {Pagination} from '../models/Pagination';
import {PaginationDataService} from './data/pagination-data.service';
import {Router} from '@angular/router';

/**
 * Business permettant de gérer les requêtes au niveau de l'api pour l'objet catégorie.
 */

@Injectable()
export class PaginationService {

  private page: Pagination;

  constructor(
    private router: Router,
    private pageData: PaginationDataService
  ) {
    this.page = new Pagination(0, 0, 0, 0);
  }

  public async paginationUtilisateur(page: number, nombreUtilisateur: number) {
    this.page = await this.pageData.getUtilisateur(page, nombreUtilisateur);
  }

  public async paginationProduit(page: number, nombreProduit: number) {
    this.page = await this.pageData.getProduit(page, nombreProduit);
  }

  public redirection(url: String) {
    if (this.page.pageActuelle < 0)
      this.router.navigate([url, this.page.pageMin]);
    else if (this.page.pageActuelle > this.page.pageMax) {
      this.router.navigate([url, this.page.pageMax]);
    }
  }

  public refreshURL(url: String): void {
    this.router.navigate([url]);
  }

  public getArray(): Array<any> {
    return this.page.tableau;
  }

  public getMaxPage(): number {
    return this.page.pageMax;
  }

  public getMinPage(): number {
    return this.page.pageMin;
  }

  public getTotal(): number {
    return this.page.total;
  }

  public getActualPage(): number {
    return this.page.pageActuelle;
  }
}




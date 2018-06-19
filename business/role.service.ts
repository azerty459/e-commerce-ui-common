
import { Injectable } from '@angular/core';
import {RoleDataService} from './data/role-data.service';
import {Role} from "../models/Role";

/**
 * Business permettant de gérer les requêtes au niveau de l'api pour l'objet catégorie.
 */

@Injectable()
export class RoleService {

  constructor(private roleData: RoleDataService) {}

  public async getAll(): Role[] {
    return await this.roleData.getRole();
  }
}




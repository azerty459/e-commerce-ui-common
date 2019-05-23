export class Role {

  constructor(
    public id: number,
    public nom: string,
  ) {
  }

  public static clone(role: Role): Role {
    return new Role(role.id, role.nom);
  }

  public static equals(role1: Role, role2: Role): boolean {
    if (role1 === role2) {
      return true;
    }
    if (role1 === undefined || role2 === undefined) {
      return false;
    }
    let retour = role1.id === role2.id;
    retour = retour && role1.nom === role2.nom;
    return retour;
  }

}



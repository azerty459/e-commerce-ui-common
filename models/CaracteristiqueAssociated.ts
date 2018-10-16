import {Caracteristique} from './Caracteristique';

export class CaracteristiqueAssociated {

  public caracteristique: Caracteristique;
  public value: string;

  constructor() {
  }

  public static oneFromJson(jsonObject: any): CaracteristiqueAssociated {
    const caracAssociated: CaracteristiqueAssociated = new CaracteristiqueAssociated();
    caracAssociated.caracteristique = Caracteristique.oneFromJson(jsonObject['caracteristique']);
    caracAssociated.value = jsonObject['value'];
    return caracAssociated;
  }

  public static manyFromJson(jsonObject: any): CaracteristiqueAssociated[] {
    return jsonObject.map((caracAssociatedJson) => CaracteristiqueAssociated.oneFromJson(caracAssociatedJson));
  }
}

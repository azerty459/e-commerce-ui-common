import {Injectable} from "@angular/core";

@Injectable()
export class FormEditService{

  private dirty: boolean = false;

  constructor(){}

  public isDirty(): boolean{
    return this.dirty;
  }

  public setDirty(dirty: boolean){
    this.dirty = dirty;
  }

  public clear(){
    this.dirty = false;
  }
}

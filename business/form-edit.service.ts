import {Injectable} from '@angular/core';

@Injectable()
export class FormEditService {

  private _dirty = false;

  constructor() {}

  public isDirty(): boolean {
    return this._dirty;
  }

  public setDirty(dirty: boolean) {
    this._dirty = dirty;
  }

  public clear() {
    this._dirty = false;
  }
}

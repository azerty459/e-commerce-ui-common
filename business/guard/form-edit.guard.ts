import {CanDeactivate} from '@angular/router';
import {FormEditService} from '../form-edit.service';
import {Injectable} from '@angular/core';
import {Modal} from 'ngx-modialog/plugins/bootstrap';

@Injectable()
export class FormEditGuard implements CanDeactivate<any> {

  constructor(private formEditService: FormEditService, private modal: Modal) {
  }

  async canDeactivate() {
    if (!this.formEditService.isDirty()) {
      return true;
    }
    const dialogRef = this.modal.confirm()
      .size('lg')
      .isBlocking(true)
      .showClose(false)
      .keyboard(27)
      .title('Edition en cours')
      .body('Vous avez une édition en cours, êtes-vous sûr de vouloir quitter la page ?')
      .okBtn('Oui')
      .okBtnClass('btn btn-danger')
      .cancelBtn('Non')
      .open();

    let choix = dialogRef.result
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
    return await choix;
  }
}

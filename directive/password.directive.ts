import {AbstractControl, FormGroup} from '@angular/forms';

/**
 * Validateur qui verifie que le mot de passe comporte au moins une minuscule, une majuscule, un chiffre,
 * un caractère speciale et que sa taille est de 8 caractères ou plus
 * @param control
 */
export function passwordStrengthValidator(control: AbstractControl): { [key: string]: any } | null {
  return /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,}$/gm.test(control.value) ? null : {value: control.value};
}

/**
 * Validateur qui verifie que le mot de passe comporte au moins une minuscule, une majuscule, un chiffre,
 * un caractère speciale et que sa taille est de 8 caractères ou plus
 * Ou que le mot de passe est vide car il est optionelle
 * @param control
 */
export function passwordStrengthValidatorOptional(control: AbstractControl): { [key: string]: any } | null {
  if (control.value.trim() === '') {
    return null;
  }
  return passwordStrengthValidator(control);
}

/**
 * Verification que le mot de passe et la verification sont identiques
 * @param group
 */
export function samePasswordAndVerification(group: FormGroup) {
  return group.value.mdp === group.value.verifMdp ? null : {notSame: true};
}

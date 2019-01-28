import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

/**
 * Service that brings different form generic validations.
 */
@Injectable()
export class CustomValidatorsService {
  /**
   * CustomValudatorService constructor.
   */
  constructor() { }

  /**
   * Validates if email has at least a @ symbol.
   * @param control form information about email input.
   * @returns Object with valud false if not validated. Null otherwhise.
   */
  public emailDomainValidator(control: FormControl): object {
    let email = control.value;
    if (control.dirty && email) {
      if (email.indexOf("@") == -1) {
        return {
          validateEmail: {
            valid: false
          }
        }
      }
    }
    return null;
  }

  /**
   * Validates if password input has at least 1 symbol written.
   * @param control form information about password input.
   * @returns Object with valud false if not validated. Null otherwhise.
   */
  public passwordValidator(control: FormControl): object {
    let password = control.value;
    if(!control.pristine) {
      if(!password) {
        return {
          validatePassword: {
            valid: false
          }
        }
      }
    }
    return null;
  }
}

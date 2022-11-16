import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsPasswordPatternCorrect', async: false })
export class IsPasswordPatternCorrect implements ValidatorConstraintInterface {
  validate(password: string): boolean {
    let isValidPassword = true;

    if (
      !/[a-z]/.test(password) ||
      !/[A-Z]/.test(password) ||
      !/\d/.test(password) ||
      !/[!@#$%^&*]/.test(password)
    ) {
      isValidPassword = false;
    }

    return isValidPassword;
  }

  defaultMessage() {
    return 'Password pattern is incorrect, it must contain at least 1 upper case letter and 1 lower case letter and 1 digit and 1 special character.';
  }
}

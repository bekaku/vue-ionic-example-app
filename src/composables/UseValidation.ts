import { validateEmail, isNumber } from '@/utils/AppUtil';
import { useLang } from './UseLang';
export const useValidation = () => {
  const { t } = useLang();
  const rePwdStrong = /^(?=.*[A-Z])(?=.*\d)[A-Z\d]{8,}$/i;

  const required = (val: any) =>
    (val && val.length > 0) || t('error.validateRequireField');

  const requiredNumber = (val: string) =>
    isNumber(val) || t('error.validateNumber');

  const requiredPositiveNumber = (val: string) =>
    (isNumber(val) && Number.parseInt(val) > 0) || t('error.validateNumber');

  const requireField = (val: string, fieldName: string) =>
    (val && val.length > 0) || t('error.validateRequire', [fieldName]);

  const requireEmail = (val: any) =>
    (val && val.length > 0 && validateEmail(val) != null)
    || t('error.emailValidate');

  const validateMax = (val: string, max: number, fieldName: string) =>
    val.length <= max || t('error.validateMax', [fieldName, max]);

  const validateMaxValue = (val: number, max: number, fieldName: string) =>
    (val > 0 && val <= max) || t('error.validateMaxValue', [fieldName, max]);
  const validateMinValue = (val: number, min: number, fieldName: string) =>
    val >= min || t('error.validateMinValue', [fieldName, min]);

  const validatePasswordStrong = (pwd: string) => rePwdStrong.test(pwd);
  const validatePasswordStrongV2 = (password: string) => {
    // Initialize variables
    let strength = 0;
    let tips = '';

    // Check password length
    if (password.length < 8) {
      tips += 'Make the password longer. ';
    } else {
      strength += 1;
    }

    // Check for mixed case
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) {
      strength += 1;
    } else {
      tips += 'Use both lowercase and uppercase letters. ';
    }

    // Check for numbers
    if (password.match(/\d/)) {
      strength += 1;
    } else {
      tips += 'Include at least one number. ';
    }

    // Check for special characters
    if (password.match(/[^a-z\d]/i)) {
      strength += 1;
    } else {
      tips += 'Include at least one special character. ';
    }

    return strength > 2;
    // Return results
    // if (strength < 2) {
    //   // return 'Easy to guess. ' + tips;
    //   return false;
    // } else if (strength === 2) {
    //   // return 'Medium difficulty. ' + tips;
    //   return true;
    // } else if (strength === 3) {
    //   // return 'Difficult. ' + tips;
    //   return true;
    // } else {
    //   // return 'Extremely difficult. ' + tips;
    //   return true;
    // }
  };
  return {
    required,
    requireField,
    requireEmail,
    validateMax,
    validateMaxValue,
    validatePasswordStrong,
    validateMinValue,
    requiredNumber,
    requiredPositiveNumber,
    validatePasswordStrongV2
  };
};

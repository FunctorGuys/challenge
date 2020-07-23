import { validateForm } from '../../utils';
import * as AuthRequest from '../../api/AuthRequest';

export const validate = (inputs) => {
  return validateForm(inputs)
}

export const signUp = (data) => {
  return AuthRequest.signUp(data);
}

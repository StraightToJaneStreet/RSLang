import { injectable } from 'inversify';

import store from '../model/store';
import { auth } from '../model/api/public';
import { slice as registrationFormSlice } from '../model/feature/forms/registration';

import IRegisterService, { CreateUserParams } from './interfaces/IRegisterationService';

import {
  isCustomError,
  isFetchError,
  isParsingError,
  isSerializedError,
  isSuccessResponse,
  isUnknownError,
} from './utils/ErrorResponse';

@injectable()
export default class RegisterService implements IRegisterService {
  async createUser({ name, email, password }: CreateUserParams): Promise<boolean> {
    const result = auth.endpoints.createUser.initiate({ name, email, password });
    const sub = store.dispatch(result);

    return sub.then((response) => {
      if (isSuccessResponse(response)) {
        const { success } = registrationFormSlice.actions;
        store.dispatch(success('Вы успешно зарегестрировались'));

        return true;
      }

      const { error } = response;

      let message = '';

      if (isSerializedError(error)) {
        message = error.message ?? 'Неизвестная ошибка';
      } else if (isUnknownError(error)) {
        message = 'Неизвестная ошибка';
      } else if (isParsingError(error)) {
        message = error.data;
      } else if (isFetchError(error) || isCustomError(error)) {
        message = error.error;
      } else {
        throw Error('Undefined behavior');
      }

      const { fail } = registrationFormSlice.actions;
      store.dispatch(fail(message));

      return false;
    });
  }
}

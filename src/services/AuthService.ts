import { injectable } from 'inversify';

import IAuth from '../core/IAuth';

import store from '../model/store';
import { slice as loginFormSlice } from '../model/feature/forms/login';
import { auth as authApi } from '../model/api/public';

import IAuthService, { AuthorizeParams } from './interfaces/IAuthService';

import { clearAuth, selectState, setAuth } from '../model/feature/auth';

import {
  isCustomError,
  isFetchError,
  isParsingError,
  isSerializedError,
  isSuccessResponse,
  isUnknownError,
} from './utils/ErrorResponse';

import { LOCAL_STORAGE_AUTH_KEY } from '../core/constants';

@injectable()
export default class AuthService implements IAuthService {
  async authorize({ email, password }: AuthorizeParams): Promise<boolean> {
    const result = authApi.endpoints.signin.initiate({ email, password });
    const sub = store.dispatch(result);

    return sub.then((response) => {
      if (isSuccessResponse(response)) {
        const { userId, name, token, refreshToken } = response.data;

        this.login({
          name,
          token,
          refreshToken,
          id: userId,
        });

        const { success } = loginFormSlice.actions;
        store.dispatch(success('Вы успешно авторизовались'));

        return true;
      }

      const error = response.error;

      let message = '';

      if (isSerializedError(error)) {
        message = error.message ?? 'Неизвестная ошибка';
      } else if (isUnknownError(error)) {
        message = 'Неизвестная ошибка';
      } else if (isParsingError(error)) {
        message = error.data ?? 'Неизвестная ошибка';
      } else if (isFetchError(error) || isCustomError(error)) {
        message = error.error;
      } else {
        throw Error('Undefined behavior');
      }

      const { fail } = loginFormSlice.actions;
      store.dispatch(fail(message));

      return false;
    });
  }

  start(): void {
    const storagedUserParams = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);

    if (storagedUserParams !== null) {
      const auth: IAuth = JSON.parse(storagedUserParams);
      this.login(auth);
    }
  }

  login(auth: IAuth) {
    store.dispatch(setAuth(auth));
    localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(auth));
  }

  logout(): void {
    store.dispatch(clearAuth());
    localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
  }

  getAuth(): IAuth | null {
    const { user: params } = selectState(store.getState());
    return params;
  }
}

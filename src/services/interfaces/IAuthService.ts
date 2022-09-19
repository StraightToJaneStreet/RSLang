import IAuth from '../../core/IAuth';

export interface AuthorizeParams {
  email: string;
  password: string;
}

interface IAuthService {
  authorize(params: AuthorizeParams): Promise<boolean>;
  start(): void;
  logout(): void;
  getAuth(): IAuth | null;
}

export default IAuthService;

export interface CreateUserParams {
  name: string;
  email: string;
  password: string;
}

interface IRegisterService {
  createUser: (params: CreateUserParams) => Promise<boolean>;
}

export default IRegisterService;

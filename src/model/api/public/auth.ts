import { baseApi } from './baseApi';

type CreateUserArg = {
  name: string;
  email: string;
  password: string;
};

type CreateUserResponse = {
  name: string;
  email: string;
  password: string;
};

type SigninArg = {
  email: string;
  password: string;
};

type SigninResponse = {
  message: string;
  name: string;
  userId: string;
  token: string;
  refreshToken: string;
};

export const auth = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createUser: build.mutation<CreateUserResponse, CreateUserArg>({
      query: ({ email, name, password }) => ({
        url: `/users`,
        method: 'POST',
        body: {
          email,
          name,
          password,
        },
      }),
    }),
    signin: build.mutation<SigninResponse, SigninArg>({
      query: ({ email, password }) => ({
        url: `/signin`,
        method: 'POST',
        body: {
          email,
          password,
        },
      }),
    }),
  }),
});

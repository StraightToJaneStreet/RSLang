import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

import { IWord } from '../../core/IWord';

import { RootState } from '../store';
import { selectState as selectUserAuthParams } from '../feature/auth';
import { UserWordParameters } from '../../services/interfaces/IWordsService';

export type User = {
  name: string;
  email: string;
  password: string;
};

export type ArgUserId = {
  id: string;
};

export type UserWordPayload = UserWordParameters;

export type UserWord = {
  difficulty: string;
  optional: UserWordPayload;
};

export type GetUserWordArg = {
  id: string;
  wordId: string;
};

export type GetUserWordResponse = {
  id: string;
  wordId: string;
  difficulty: string;
  optional: UserWordPayload;
};

export type UpdateUserWordArg = {
  id: string;
  wordId: string;
  difficulty: string;
  optional: UserWordPayload;
};

export type UpdateUserWordResponse = {
  id: string;
  wordId: string;
  difficulty: string;
  optional: UserWordPayload;
};

export type GetUserWordsArg = {
  id: string;
};

export type GetUserWordsResponse = GetUserWordResponse[];

export type CreateUserWordArg = {
  id: string;
  wordId: string;
  difficulty: string;
  payload: UserWordPayload;
};

export type CreateUserWordResponse = {
  id: string;
  wordId: UserWordPayload;
};

export type DeleteUserWordsArg = {
  id: string;
  wordId: string;
};

export type ReadWordsArg = {
  group: string;
  page: string;
};

export type ReadWordResponse = IWord;

export type ReadWordsResponse = IWord[];

export type CreateUserArg = {
  name: string;
  email: string;
  password: string;
};

export type CreateUserResponse = {
  name: string;
  email: string;
  password: string;
};

export type SigninArg = {
  email: string;
  password: string;
};

export type SigninResponse = {
  userId: string;
  token: string;
  refreshToken: string;
  message: string;
  name: string;
};

const enpointsWithAuthorization = [
  'createUserWord',
  'readUserWords',
  'readUserWord',
  'updateUserWord',
  'deleteUserWord',
];

export const api = createApi({
  reducerPath: 'api',
  tagTypes: ['UserWord'],
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://react-learnwords-example.herokuapp.com',
    prepareHeaders(headers, { getState, endpoint }) {
      if (enpointsWithAuthorization.includes(endpoint)) {
        const state: RootState = getState() as RootState;
        const userAuthParams = selectUserAuthParams(state);
        if (userAuthParams.user !== null) {
          const { token } = userAuthParams.user;
          headers.set('Authorization', `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    readWords: builder.query<ReadWordsResponse, ReadWordsArg>({
      query: ({ group, page }) => ({
        url: `/words`,
        params: {
          group,
          page,
        },
      }),
    }),

    createUserWord: builder.mutation<CreateUserWordResponse, CreateUserWordArg>({
      invalidatesTags: ['UserWord'],
      query: ({ id, wordId, difficulty, payload }) => ({
        url: `/users/${id}/words/${wordId}`,
        method: 'POST',
        body: {
          difficulty,
          optional: payload,
        },
      }),
    }),

    readUserWords: builder.query<GetUserWordsResponse, ArgUserId>({
      providesTags: ['UserWord'],
      query: ({ id }) => ({
        url: `/users/${id}/words`,
      }),
    }),

    readUserWord: builder.query<GetUserWordResponse, GetUserWordArg>({
      providesTags: ['UserWord'],
      query: ({ id, wordId }) => ({
        url: `/users/${id}/words/${wordId}`,
      }),
    }),

    updateUserWord: builder.mutation<UpdateUserWordResponse, UpdateUserWordArg>({
      invalidatesTags: ['UserWord'],
      query: ({ id, wordId, difficulty, optional }) => ({
        url: `users/${id}/words/${wordId}`,
        method: 'PUT',
        body: {
          difficulty,
          optional,
        },
      }),
    }),

    deleteUserWord: builder.mutation<void, DeleteUserWordsArg>({
      invalidatesTags: ['UserWord'],
      query: ({ id, wordId }) => ({
        url: `/users/${id}/words/${wordId}`,
        method: 'DELETE',
      }),
    }),

    createUser: builder.mutation<CreateUserResponse, CreateUserArg>({
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

    signin: builder.mutation<SigninResponse, SigninArg>({
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

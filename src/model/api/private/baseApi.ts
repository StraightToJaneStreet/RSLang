import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

import { RootState } from '../../store';
import { selectState as selectAuth } from '../../feature/auth';

import { API_ADDRESS } from '../apiConfig';

export const baseApi = createApi({
  reducerPath: 'privateApi',
  tagTypes: ['User', 'Word', 'UserWord', 'Setting', 'Statistics'],

  baseQuery: fetchBaseQuery({
    baseUrl: API_ADDRESS,
    prepareHeaders(headers, { getState }) {
      const { user } = selectAuth(getState() as RootState);

      if (user === null) {
        return headers;
      }

      headers.set('Authorization', `Bearer ${user.token}`);

      return headers;
    },
  }),

  endpoints: () => ({}),
});

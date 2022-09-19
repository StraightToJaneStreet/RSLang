import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

const API_ADDRESS = 'https://react-learnwords-example.herokuapp.com';

export const baseApi = createApi({
  reducerPath: 'publicApi',
  tagTypes: ['User', 'Word'],

  baseQuery: fetchBaseQuery({
    baseUrl: API_ADDRESS,
  }),

  endpoints: () => ({}),
});

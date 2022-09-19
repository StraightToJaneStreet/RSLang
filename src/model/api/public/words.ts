import { baseApi } from './baseApi';
import { Word } from '../shemas';

type QueryWordsArg = {
  group: number;
  page: number;
};

type ReadWordArg = {
  wordId: string;
};

export const words = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getWords: build.query<Word[], QueryWordsArg>({
      query: ({ group, page }) => ({
        url: 'words',
        params: { group, page },
      }),
    }),

    readWord: build.query<Word, ReadWordArg>({
      query: ({ wordId }) => ({
        url: `words/${wordId}`,
      }),
    }),
  }),
});

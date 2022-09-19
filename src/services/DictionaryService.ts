import { injectable } from 'inversify';

import store from '../model/store';
import IDictionaryService from './interfaces/IDictionaryService';

import { setGroup, setPage } from '../model/feature/dictionary';

import { LOCAL_STORAGE_DICTIONARY_DIFFICULT_KEY, LOCAL_STORAGE_DICTIONARY_PAGENUMBER_KEY } from '../core/constants';

@injectable()
export default class DictionaryService implements IDictionaryService {
  start(): void {
    const difficult = +(localStorage.getItem(LOCAL_STORAGE_DICTIONARY_DIFFICULT_KEY) ?? 1);
    const pageNumber = +(localStorage.getItem(LOCAL_STORAGE_DICTIONARY_PAGENUMBER_KEY) ?? 0);
    store.dispatch(setGroup(pageNumber));
    store.dispatch(setGroup(difficult));
  }

  setPage(pageNumber: number): void {
    store.dispatch(setPage(pageNumber));
    localStorage.setItem(LOCAL_STORAGE_DICTIONARY_PAGENUMBER_KEY, String(pageNumber));
  }

  setDifficulty(difficulty: number): void {
    store.dispatch(setGroup(difficulty));
    localStorage.setItem(LOCAL_STORAGE_DICTIONARY_DIFFICULT_KEY, String(difficulty));
  }
}

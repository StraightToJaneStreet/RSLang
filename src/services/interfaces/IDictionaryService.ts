interface IDictionaryService {
  start: () => void;
  setPage: (pageNumber: number) => void;
  setDifficulty: (difficult: number) => void;
}

export default IDictionaryService;

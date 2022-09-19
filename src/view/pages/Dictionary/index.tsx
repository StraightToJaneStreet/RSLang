import React from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import Container from '@mui/material/Container';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import WordCard from './WordCard';

import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import DIContainer from '../../../DI/DIContainer';
import DI_TYPES from '../../../DI/DITypes';
import IDictionaryService from '../../../services/interfaces/IDictionaryService';
import { selectState as selectDictionaryState } from '../../../model/feature/dictionary';

import { words as wordsApi } from '../../../model/api/public';
import { userWords as userWordsApi } from '../../../model/api/private';
import { selectState as selectAuthState } from '../../../model/feature/auth';
import { GetUserWordResponse } from "../../../model/api/private/userWords";

import IWord from '../../../core/IWord';

export const groups = ['#ff0000', '#FFA500', '#FFD700', '#008000', '#66CDAA', '#0000FF'];

type WordMapping = {
  [wordId: string]: {
    word: IWord;
    params?: GetUserWordResponse;
  };
};

const Main = () => {
  const dictionaryService = DIContainer.get<IDictionaryService>(DI_TYPES.DictionaryService);

  const { group: group, pageNumber: page } = useSelector(selectDictionaryState);

  const { data: words } = wordsApi.useGetWordsQuery({ group, page });

  const { user } = useSelector(selectAuthState);

  const { data: wordsParams } = userWordsApi.useReadUserWordsQuery(
    { id: user?.id ?? '' },
    { skip: user?.id ? false : true }
  );

  const wordsMap: WordMapping = {};

  if (words) {
    words.forEach((word) => {
      wordsMap[word.id] = {
        word,
      };
    });
  }

  if (wordsParams) {
    wordsParams.forEach((params) => {
      if (params.wordId in wordsMap) {
        wordsMap[params.wordId].params = params;
      }
    });
  }

  const setPageNumber = (newPageNumber: number) => {
    dictionaryService.setPage(newPageNumber);
  };

  const setDifficulty = (newDifficult: number) => {
    dictionaryService.setDifficulty(newDifficult);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [words]);

  const calculatePageLearned = (wordsMap: WordMapping): boolean => {
    return Object.entries(wordsMap).filter((word) => word[1].params?.difficulty === 'LEARNED').length === 20;
  }
  console.log(wordsParams);
  const isPageLearned = (wordsParams) ? calculatePageLearned(wordsMap) : false;

  return (
    <Container sx={{ backgroundColor: isPageLearned ? "#9c27b0" : undefined }}>
      <Paper component={'div'} sx={{ padding: 5 }}>
        <Box display="flex" gap="20px">
          <Button component={Link} to={`/games/sprint/${group}/${page}`} variant="outlined">
            Спринт
          </Button>
          <Button component={Link} to={`/games/audiocall/${group}/${page}`} variant="outlined">
            Аудиовызов
          </Button>
          {user?.id ? (
            <Button component={Link} to={'/dictionary/hardwords'} variant="contained">
              Сложные слова
            </Button>
          ) : (
            ''
          )}
        </Box>
        <RadioGroup row value={group} onChange={(_e, value) => setDifficulty(+value)}>
          {groups.map((color, ind) => (
            <FormControlLabel
              key={ind}
              value={ind}
              label={ind + 1}
              control={
                <Radio
                  sx={{
                    '&.Mui-checked': {
                      color,
                    },
                  }}
                />
              }
            />
          ))}
        </RadioGroup>
        <Box>
          <Grid container spacing={5} marginBottom="30px" >
            {Object.entries(wordsMap).map(([wordId, { word, params }]) => (
              <Grid item xs={4} key={wordId} >
                <WordCard word={word} params={params} hideButtons={false} />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box display="flex" justifyContent="center" >
          <Pagination count={29} color={ isPageLearned ? "secondary" : 'standard' } page={page} onChange={(_e, newPage) => setPageNumber(newPage)} />
        </Box>
      </Paper>
    </Container>
  );
};

export default Main;

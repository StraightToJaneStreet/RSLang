import React from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';

import WordCard from '../WordCard';

import { Typography } from '@mui/material';
import { selectState as selectAuth } from '../../../../model/feature/auth';
import { userWords } from '../../../../model/api/private';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { selectState as selectDictionaryState } from '../../../../model/feature/dictionary';
import DIContainer from '../../../../DI/DIContainer';
import IDictionaryService from '../../../../services/interfaces/IDictionaryService';
import DI_TYPES from '../../../../DI/DITypes';

type HardWordsProps = {
  userId: string;
};

const HardWords = ({ userId }: HardWordsProps) => {
  const dictionaryService = DIContainer.get<IDictionaryService>(DI_TYPES.DictionaryService);
  const { group } = useSelector(selectDictionaryState);

  const { data: words } = userWords.useGetAggregatedHardWordsQuery({ userId: userId, group: group });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [words]);

  const setDifficulty = (newDifficult: number) => {
    dictionaryService.setDifficulty(newDifficult);
  };

  return (
    <Container>
      <Paper component={'div'} sx={{ padding: 5 }}>
        <h1>Сложные слова</h1>
        <RadioGroup row value={group} onChange={(_e, value) => setDifficulty(+value)}>
          <FormControlLabel value="0" control={<Radio />} label="1" />
          <FormControlLabel value="1" control={<Radio />} label="2" />
          <FormControlLabel value="2" control={<Radio />} label="3" />
          <FormControlLabel value="3" control={<Radio />} label="4" />
          <FormControlLabel value="4" control={<Radio />} label="5" />
          <FormControlLabel value="5" control={<Radio />} label="6" />
        </RadioGroup>
        <Grid container spacing={5} marginBottom="30px">
          {words &&
            words?.map((word) => (
              <Grid item xs={4} key={word.id}>
                <WordCard word={word} hideButtons={true} />
              </Grid>
            ))}
        </Grid>
      </Paper>
      {!words ? <Paper>В данном разделе нет слов</Paper> : ''}
    </Container>
  );
};

const HardWordsWrapper = () => {
  const { user } = useSelector(selectAuth);

  const isPageForbidden = user === null;

  return (
    <>
      {isPageForbidden ? (
        <Typography>Вы должны быть авторизированы для просмотра этой страницы</Typography>
      ) : (
        <HardWords userId={user.id} />
      )}
    </>
  );
};

export default HardWordsWrapper;

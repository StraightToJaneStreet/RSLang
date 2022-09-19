import React from 'react';
import { useSelector } from 'react-redux';

import DIContainer from '../../../DI/DIContainer';
import DI_TYPES from '../../../DI/DITypes';

import { selectState as selectAuthParams } from '../../../model/feature/auth';

import IWord from '../../../core/IWord';

import IWordsService from '../../../services/interfaces/IWordsService';

import Button from '@mui/material/Button';

import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import AudioPlayer from '../../components/AudioPlayer';

import IAuth from '../../../core/IAuth';
import { Box, Typography } from '@mui/material';
import { GetUserWordResponse } from '../../../model/api/private/userWords';
import { WordDifficulty } from '../../../core/WordDifficulty';
import { groups } from '.';

const getPath = (entity: string) => `https://react-learnwords-example.herokuapp.com/${entity}`;

type WordCardExtensionProps = {
  wordId: string;
  wordParams?: GetUserWordResponse;
  auth: IAuth;
};

const WordCardExtension = ({ wordId, auth: { id: userId }, wordParams }: WordCardExtensionProps) => {
  const wordsService: IWordsService = DIContainer.get(DI_TYPES.WordsService);

  const isAddToDifficultEnabled = wordParams?.difficulty !== WordDifficulty.HARD;
  const isAddToLearnedEnabled = wordParams?.difficulty !== WordDifficulty.LEARNED;

  const handleAddToDifficult = () => {
    wordsService.setWordHardMark(userId, wordId);
  };

  const handleAddToLearned = () => {
    console.log('CLICK HANDLER');
    wordsService.setWordLearnedMark(userId, wordId);
  };

  return (
    <>
      <Button variant={'contained'} onClick={handleAddToLearned} disabled={!isAddToLearnedEnabled}>
        Изученное
      </Button>

      <Button variant={'contained'} onClick={handleAddToDifficult} disabled={!isAddToDifficultEnabled}>
        Сложное
      </Button>
    </>
  );
};

type WordCardProps = {
  word: IWord;
  params?: GetUserWordResponse;
  hideButtons: boolean;
};

const WordCard = ({ word, params, hideButtons }: WordCardProps) => {
  const { user: auth } = useSelector(selectAuthParams);
  return (
    <Card>
      {word.image && <CardMedia image={getPath(word.image)} sx={{ height: 200 }} />}
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5" color={`${groups[word.group]}`}>
              {word.word}
            </Typography>
            <Typography>{word.transcription}</Typography>
          </Box>
          <AudioPlayer tracks={[getPath(word.audio), getPath(word.audioMeaning), getPath(word.audioExample)]} />
        </Box>
        <Typography variant="h5" color={'#808080'}>
          {word.wordTranslate}
        </Typography>
        <Box>
          <Box>
            <Typography variant="h6" mt={2}>
              Значение
            </Typography>
            <Typography variant="body1" dangerouslySetInnerHTML={{ __html: word.textMeaning }}></Typography>
            <Typography variant="body2" dangerouslySetInnerHTML={{ __html: word.textMeaningTranslate }}></Typography>
          </Box>
        </Box>
        <Box>
          <Box>
            <Typography variant="h6" mt={2}>
              Пример
            </Typography>
            <Typography variant="body1" dangerouslySetInnerHTML={{ __html: word.textExample }}></Typography>
            <Typography variant="body2" dangerouslySetInnerHTML={{ __html: word.textExampleTranslate }}></Typography>
          </Box>
        </Box>
      </CardContent>
      <CardActions>
        {auth && !hideButtons && <WordCardExtension auth={auth} wordId={word.id} wordParams={params} />}
      </CardActions>
    </Card>
  );
};

export default WordCard;

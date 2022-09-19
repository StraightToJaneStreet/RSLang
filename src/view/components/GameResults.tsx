import React from 'react';

import { words as wordsApi } from '../../model/api/public';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import AudioPlayer from './AudioPlayer';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

const getPath = (entity: string) => `https://react-learnwords-example.herokuapp.com/${entity}`;

type WordProps = {
  wordId: string;
};

const Word = ({ wordId }: WordProps) => {
  const { data: word } = wordsApi.useReadWordQuery({ wordId });

  return (
    <ListItem>
      {word && (
        <>
          <ListItemIcon>
            <AudioPlayer tracks={[getPath(word.audio)]} />
          </ListItemIcon>
          <ListItemText>
            <Typography>
              {word.word} {word.transcription} - {word.wordTranslate}
            </Typography>
          </ListItemText>
        </>
      )}
    </ListItem>
  );
};

type WordsListProps = {
  title: string;
  words: string[];
  countAnswers: number;
  color: string;
};

const WordsList = ({ title, words, countAnswers, color }: WordsListProps) => {
  return (
    <Box sx={{borderBottom: '1px solid grey', mt: 2}}>
      <Typography variant='h6' color={color}>{title} - {countAnswers}</Typography>
      <List dense>
        {words.map((wordId) => (
          <Word key={wordId} wordId={wordId} />
        ))}
      </List>
    </Box>
  );
};

export type Results = {
  correctAnswers: string[];
  incorrectAnswers: string[];
};

type GameResultsProps = {
  results: Results;
};

const GameResults = ({ results }: GameResultsProps) => {
  return (
    <Box>
      <Typography variant='h5' sx={{borderBottom: '1px solid grey'}}>Игра окончена</Typography>
      {<WordsList title="Верно" color="green" countAnswers={results.correctAnswers.length} words={results.correctAnswers} />}
      {<WordsList title="Неверно" color="red" countAnswers={results.incorrectAnswers.length} words={results.incorrectAnswers} />}
      <Box display="flex" gap="40px" justifyContent='center' mt={4}>
        <Button component={Link} to={`/games`} variant="outlined">
          К играм
        </Button>
        <Button component={Link} to={`/dictionary`} variant="outlined">
          В словарь
        </Button>
      </Box>

    </Box>
  );
};

export default GameResults;

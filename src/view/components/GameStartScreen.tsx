import React from 'react';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';

const pageIndicies = Array(30)
  .fill(0)
  .map((_, ind) => ind);

type StartScreenProps = {
  group: number;
  page: number;
  setPage: (page: number) => void;
  setGroup: (group: number) => void;
  startGame: () => void;
};

const StartScreen = ({ group, page, setGroup, setPage, startGame }: StartScreenProps) => {
  return (
    <>
      <InputLabel id="audio-challenge-start-group">Сложность</InputLabel>
      <Select
        labelId="audio-challenge-start-group"
        value={group}
        onChange={(e) => setGroup(+e.target.value)}
        sx={{ width: 150, mb: 3 }}
      >
        <MenuItem value={0}>1</MenuItem>
        <MenuItem value={1}>2</MenuItem>
        <MenuItem value={2}>3</MenuItem>
        <MenuItem value={3}>4</MenuItem>
        <MenuItem value={4}>5</MenuItem>
        <MenuItem value={5}>6</MenuItem>
      </Select>

      <InputLabel id="audio-challenge-start-page">Страница</InputLabel>
      <Select
        labelId="audio-challenge-start-page"
        value={page}
        onChange={(e) => setPage(+e.target.value)}
        sx={{ width: 150, mb: 3 }}
      >
        {pageIndicies.map((page) => (
          <MenuItem key={page} value={page}>{` ${page + 1} `}</MenuItem>
        ))}
      </Select>

      <Button variant={'contained'} onClick={startGame}>
        Start
      </Button>
    </>
  );
};

export default StartScreen;

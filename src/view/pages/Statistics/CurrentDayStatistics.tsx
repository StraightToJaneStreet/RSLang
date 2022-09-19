import React from 'react';

import { DailyStatistics } from '../../../core/Statistics';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import StatWordCard from './StatWordCard';
import DailyGameStatistics from './DailyGameStatistics';
import GameType from '../../../core/GameType';
import { calculatePercentage } from './calculations';

export type CurrentDayStatisticsProps = {
  statistics: DailyStatistics;
};

const CurrentDayStatistics = ({ statistics }: CurrentDayStatisticsProps) => {
  const learnedFromGames = statistics.sprintGame.learnedWordsCount + statistics.audioGame.learnedWordsCount;
  const totalFromGames = statistics.sprintGame.totalWordsCount + statistics.audioGame.totalWordsCount;

  const learnedWithDict = learnedFromGames + statistics.learnedWordsCount;

  const percentage = calculatePercentage(learnedFromGames, totalFromGames);

  return (
    <>
      <Box className="stat-for-day" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography margin="30px auto" variant="h4">
          Статистика за сегодня
        </Typography>

        <Typography margin="10px auto 5px" variant="h5">
          Слова
        </Typography>
        <Box className="stat-word" sx={{ display: 'flex', flexWrap: 'wrap' }}>
          <StatWordCard value={String(totalFromGames)} title="новых слов" />
          <StatWordCard value={String(learnedWithDict)} title="изученных слов" />
          <StatWordCard value={percentage} title="% правильных ответов" />
        </Box>

        <Typography margin="10px auto 5px" variant="h5">
          Мини-игры
        </Typography>

        <Box className="stat-games" sx={{ display: 'flex', flexWrap: 'wrap' }}>
          <DailyGameStatistics gameTitle="Аудиовызов" statistics={statistics[GameType.AudioChallenge]} />

          <DailyGameStatistics gameTitle="Спринт" statistics={statistics[GameType.AudioChallenge]} />
        </Box>
      </Box>
    </>
  );
};

export default CurrentDayStatistics;

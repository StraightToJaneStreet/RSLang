import React from 'react';

import { FC } from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { DailyGameStatistics } from '../../../core/Statistics';
import { calculatePercentage } from './calculations';

export type StatGamesCardProps = {
  gameTitle: string;
  statistics: DailyGameStatistics;
};

const DailyGameStatistics: FC<StatGamesCardProps> = ({ gameTitle, statistics }) => {
  const percentage = calculatePercentage(statistics.learnedWordsCount, statistics.totalWordsCount);

  return (
    <Card sx={{ minWidth: 400, margin: 2 }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography margin={2} variant="h5" sx={{ textAlign: 'center' }}>
          {gameTitle}
        </Typography>
        <Typography mb={1} variant="body1">
          Количество новых слов: {statistics.totalWordsCount}
        </Typography>
        <Typography mb={1} variant="body1">
          Процент правильных слов: {percentage}
        </Typography>
        <Typography variant="body1">Самая длинная серия правильных ответов: {statistics.bestSession}</Typography>
      </CardContent>
    </Card>
  );
};

export default DailyGameStatistics;

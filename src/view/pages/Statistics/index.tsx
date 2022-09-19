import React from 'react';

import { useSelector } from 'react-redux';

import Statistics, { DailyStatistics } from '../../../core/Statistics';

import { selectState as selectAuthParams } from '../../../model/feature/auth';
import { statistic as statApi } from '../../../model/api/private';

import { Box, Container, Typography } from '@mui/material';

import CurrentDayStatistics from './CurrentDayStatistics';
import GlobalGameStatistics from './GlobalGameStatistics';
import GameType from '../../../core/GameType';
import GlobalGraphStatistics from "./GlobalGraphStatistics";

const Statistics = ({ userId }: { userId: string }) => {
  const { data: stats } = statApi.useGetStatisticQuery({ userId });
  const currentDay = new Date().toLocaleDateString();

  const isStatsForCurrentDayExists = (stats: { [day: string]: DailyStatistics }): boolean => currentDay in stats;

  return (
    <Container className="container-stat">
      <Box className="stat-wrapper">
        {stats &&
          (isStatsForCurrentDayExists(stats.optional.daysWords) ? (
            <CurrentDayStatistics statistics={stats.optional.daysWords[currentDay]} />
          ) : (
            <Typography variant="h5">Нет статистики за текущий день</Typography>
          ))}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography margin="30px auto" variant="h4">
            Общая статистика по играм
          </Typography>
          {stats && <GlobalGameStatistics game={GameType.AudioChallenge} statistics={stats.optional.daysWords} />}
          {stats && <GlobalGameStatistics game={GameType.Sprint} statistics={stats.optional.daysWords} />}
          {stats && <GlobalGraphStatistics statistics={stats.optional.daysWords} />}
        </Box>
      </Box>
    </Container>
  );
};

const StatisticsAuthWrapper = () => {
  const { user } = useSelector(selectAuthParams);

  const isPageForbidden = user === null;

  return (
    <>
      {isPageForbidden ? (
        <Typography>Вы должны быть авторизированы для просмотра этой страницы</Typography>
      ) : (
        <Statistics userId={user.id} />
      )}
    </>
  );
};

export default StatisticsAuthWrapper;

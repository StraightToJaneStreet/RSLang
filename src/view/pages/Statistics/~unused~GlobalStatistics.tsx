import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const GlobalStatistics = () => {
  return (
    <Box className="stat-all-time" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography margin="30px auto" variant="h4">
        Статистика за все время
      </Typography>
      <Box>
        <Typography margin="30px auto" variant="h5">
          Количество новых слов за каждый день
        </Typography>
      </Box>
      <Box>
        <Typography margin="30px auto" variant="h5">
          Увеличение количества изученных слов за весь период обучения
        </Typography>
      </Box>
    </Box>
  );
};

export default GlobalStatistics;

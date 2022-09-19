import React, { FC } from 'react';
import { Card, CardContent, Typography } from '@mui/material';

export interface StatWordCardProps {
  value: string;
  title: string;
}

const StatWordCard: FC<StatWordCardProps> = ({ value, title }) => {
  return (
    <Card sx={{ minWidth: 230, margin: 2 }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h6">{value}</Typography>
        <Typography variant="body1">{title}</Typography>
      </CardContent>
    </Card>
  );
};

export default StatWordCard;

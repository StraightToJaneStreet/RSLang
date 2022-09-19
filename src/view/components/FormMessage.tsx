import React from 'react';

import Alert, { AlertColor } from '@mui/material/Alert';

type FormMessageProps = {
  message: string;
  severity: AlertColor;
};

export const FormMessage = ({ message, severity }: FormMessageProps) => (
  <Alert sx={{ mb: 2 }} severity={severity}>
    {message}
  </Alert>
);

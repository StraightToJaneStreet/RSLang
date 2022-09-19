import * as React from 'react';

import { useSelector } from 'react-redux';
import { useForm, SubmitHandler } from 'react-hook-form';
import { object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import DIContainer from '../../DI/DIContainer';
import DI_TYPES from '../../DI/DITypes';

import { Box, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import IAuthService from '../../services/interfaces/IAuthService';
import { selectState } from '../../model/feature/forms/login';
import { isFailVariant, isSuccessVariant } from '../../model/helpers/forms';
import { FormMessage } from './FormMessage';
import { IStatisticsService } from '../../services/interfaces/IStatisticService';

const registerSchema = object({
  email: string().email('Неверно указан Email'),
  password: string().min(8, 'Минимальная длина пароля 8 символов').max(32, 'Максимальная длина пароля 32 символа'),
});

type AuthInput = TypeOf<typeof registerSchema>;

const AuthPage = () => {
  const authService = DIContainer.get<IAuthService>(DI_TYPES.AuthService);

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<AuthInput>({
    resolver: zodResolver(registerSchema),
  });

  const { variant: formVariant } = useSelector(selectState);

  const onSubmitHandler: SubmitHandler<AuthInput> = async (values) => {
    const result = await authService.authorize(values);
    if (result) {
      const statistics = DIContainer.get<IStatisticsService>(DI_TYPES.StatisticsService);
      await statistics.initializeStatistics();
      reset();
    }
  };

  return (
    <Box sx={{ maxWidth: '30rem' }}>
      <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit(onSubmitHandler)}>
        {isSuccessVariant(formVariant) && <FormMessage message={formVariant.message} severity={'success'} />}
        {isFailVariant(formVariant) && <FormMessage message={formVariant.message} severity={'error'} />}

        <TextField
          sx={{ mb: 2 }}
          label="Email"
          fullWidth
          required
          type="email"
          error={!!errors.email}
          helperText={errors.email ? errors.email.message : ''}
          {...register('email')}
        />
        <TextField
          sx={{ mb: 2 }}
          label="Пароль"
          fullWidth
          required
          type="password"
          error={!!errors.password}
          helperText={errors.password ? errors.password.message : ''}
          {...register('password')}
        />

        <LoadingButton variant="contained" fullWidth type="submit" loading={false} sx={{ py: '0.8rem', mt: '1rem' }}>
          Авторизоваться
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default AuthPage;

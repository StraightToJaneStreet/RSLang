import * as React from 'react';

import { useSelector } from 'react-redux';
import { useForm, SubmitHandler } from 'react-hook-form';
import { object, string, TypeOf } from 'zod';

import { Box, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { zodResolver } from '@hookform/resolvers/zod';

import DIContainer from '../../DI/DIContainer';
import DI_TYPES from '../../DI/DITypes';

import IRegisterService from '../../services/interfaces/IRegisterationService';

import { selectState as selectRegistrationFormState } from '../../model/feature/forms/registration';

import { isFailVariant, isSuccessVariant } from '../../model/helpers/forms';
import { FormMessage } from './FormMessage';

const registerSchema = object({
  login: string().min(1, 'Поле "Логин" обязательно для заполнения').max(32, 'Максимум 32 символа для логина'),
  email: string().email('Неверно указан Email'),
  password: string().min(8, 'Минимальная длина пароля 8 символов').max(32, 'Максимальная длина пароля 32 символа'),
  passwordConfirm: string().min(1, 'Поле "Подтверждение пароля" обязательно для заполнения'),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ['passwordConfirm'],
  message: 'Пароли не совпадают',
});

type RegisterInput = TypeOf<typeof registerSchema>;

const RegisterPage = () => {
  const registerService = DIContainer.get<IRegisterService>(DI_TYPES.RegistrationService);

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const { variant: formVariant } = useSelector(selectRegistrationFormState);

  const onSubmitHandler: SubmitHandler<RegisterInput> = async (values) => {
    const { login: name, email, password } = values;
    const result = await registerService.createUser({ name, email, password });
    if (result) {
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
          label="Логин"
          fullWidth
          required
          error={!!errors.login}
          helperText={errors.login ? errors.login.message : ''}
          {...register('login')}
        />
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
        <TextField
          sx={{ mb: 2 }}
          label="Подтверждение пароля"
          fullWidth
          required
          type="password"
          error={!!errors.passwordConfirm}
          helperText={errors.passwordConfirm ? errors.passwordConfirm.message : ''}
          {...register('passwordConfirm')}
        />
        <LoadingButton variant="contained" fullWidth type="submit" sx={{ py: '0.8rem', mt: '1rem' }}>
          Зарегистрироваться
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default RegisterPage;

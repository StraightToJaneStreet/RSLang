import * as React from 'react';
import {
  Box,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  TextField,
  Typography,
} from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import Checkbox from '@mui/material/Checkbox';


const registerSchema = object({
  name: string()
    .nonempty('Поле Логин обязательно для заполнения')
    .max(32, 'Максимум 32 символа для логина'),
  email: string().nonempty('Поле Email обязательно для заполнения').email('Неверно указан Email'),
  password: string()
    .nonempty('Пароль обязателен для заполнения')
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
  passwordConfirm: string().nonempty('Please confirm your password'),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ['passwordConfirm'],
  message: 'Пароли не совпадают',
});

type RegisterInput = TypeOf<typeof registerSchema>;

const RegisterPage = () => {
  const [loading] = useState(false);

  const {
    register,
    formState: { errors, isSubmitSuccessful },
    reset,
    handleSubmit,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<RegisterInput> = (values: []) => {
    console.log(values);
  };
  console.log(errors);

  return (
    <Box sx={{ maxWidth: '30rem' }}>
      <Typography variant='h4' component='h1' sx={{ mb: '2rem' }}>
        Register
      </Typography>
      <Box
        component='form'
        noValidate
        autoComplete='off'
        onSubmit={handleSubmit(onSubmitHandler)}
      >
        <TextField
          sx={{ mb: 2 }}
          label='Name'
          fullWidth
          required
          error={!!errors['name']}
          helperText={errors['name'] ? errors['name'].message : ''}
          {...register('name')}
        />
        <TextField
          sx={{ mb: 2 }}
          label='Email'
          fullWidth
          required
          type='email'
          error={!!errors['email']}
          helperText={errors['email'] ? errors['email'].message : ''}
          {...register('email')}
        />
        <TextField
          sx={{ mb: 2 }}
          label='Password'
          fullWidth
          required
          type='password'
          error={!!errors['password']}
          helperText={errors['password'] ? errors['password'].message : ''}
          {...register('password')}
        />
        <TextField
          sx={{ mb: 2 }}
          label='Confirm Password'
          fullWidth
          required
          type='password'
          error={!!errors['passwordConfirm']}
          helperText={
            errors['passwordConfirm'] ? errors['passwordConfirm'].message : ''
          }
          {...register('passwordConfirm')}
        />

        <FormGroup>
          <FormControlLabel
            control={<Checkbox required />}
            {...register('terms')}
            label={
              <Typography color={errors['terms'] ? 'error' : 'inherit'}>
                Accept Terms and Conditions
              </Typography>
            }
          />
          <FormHelperText error={!!errors['terms']}>
            {errors['terms'] ? errors['terms'].message : ''}
          </FormHelperText>
        </FormGroup>

        <LoadingButton
          variant='contained'
          fullWidth
          type='submit'
          loading={loading}
          sx={{ py: '0.8rem', mt: '1rem' }}
        >
          Register
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default RegisterPage;
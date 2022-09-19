import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../../store';
import { FormVariant, createRegularVariant, createFailVariant, createSuccessVariant } from '../../helpers/forms';

type LoginFormState = {
  variant: FormVariant;
};

const initialState: LoginFormState = {
  variant: createRegularVariant(),
};

export const slice = createSlice({
  name: 'form/login',
  initialState,
  reducers: {
    reset(state) {
      state.variant = createRegularVariant();
    },

    success(state, { payload: message }: PayloadAction<string>) {
      state.variant = createSuccessVariant(message);
    },

    fail(state, { payload: errorMessage }: PayloadAction<string>) {
      state.variant = createFailVariant(errorMessage);
    },
  },
});

export const selectState = (state: RootState): LoginFormState => state[slice.name];

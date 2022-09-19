import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import IAuth from '../../core/IAuth';
import { RootState } from '../store';

type UserInfoState = {
  user: IAuth | null;
};

const initialState: UserInfoState = {
  user: null,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, { payload: { name, id, token, refreshToken } }: PayloadAction<IAuth>) {
      state.user = { name, id, token, refreshToken };
    },

    clearAuth(state) {
      state.user = null;
    },
  },
});

export const { setAuth, clearAuth } = slice.actions;

export const selectState = (state: RootState): UserInfoState => state[slice.name];

export default slice;

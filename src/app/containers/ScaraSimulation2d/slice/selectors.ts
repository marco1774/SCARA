import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) =>
  state.scaraSimulation2d || initialState;

export const selectScaraSimulation2d = createSelector(
  [selectSlice],
  state => state,
);

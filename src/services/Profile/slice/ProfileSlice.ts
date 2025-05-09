import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getUserApi } from '../../../utils/burger-api';
import { TUser } from '@utils-types';

export interface ProfileSchema {
  data: TUser;
  isLoading: boolean;
  error?: string;
}

export const initialState: ProfileSchema = {
  data: {
    name: '',
    email: ''
  },
  isLoading: false,
  error: undefined
};

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async () => {
    const response = await getUserApi();
    return response.user;
  }
);

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.error = undefined;
        state.isLoading = true;
      })
      .addCase(
        fetchProfile.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.isLoading = false;
          state.data = action.payload;
        }
      )
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
  selectors: {
    selectProfile: (sliceState) => sliceState.data,
    selectIsLoading: (sliceState) => sliceState.isLoading
  }
});

export const { selectProfile, selectIsLoading } = profileSlice.selectors;
export const { actions: profileActions } = profileSlice;
export const { reducer: profileReducer } = profileSlice;

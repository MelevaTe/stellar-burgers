import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getOrdersApi,
  getUserApi,
  loginUserApi,
  registerUserApi,
  TLoginData,
  TRegisterData
} from '../../../utils/burger-api';
import { TOrder, TOrdersData, TUser } from '@utils-types';
import { setCookie } from '../../../utils/cookie';

export interface userSchema {
  data?: TOrder[];
  isLoading: boolean;
  error?: string;
}

const initialState: userSchema = {
  data: [],
  isLoading: false,
  error: undefined
};

export const fetchProfileOrder = createAsyncThunk(
  'profileOrder/fetchProfileOrder',
  async () => {
    const response = await getOrdersApi();
    return response;
  }
);

export const profileOrderSlice = createSlice({
  name: 'profileOrder',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrder.pending, (state) => {
        state.error = undefined;
        state.isLoading = true;
      })
      .addCase(
        fetchProfileOrder.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.isLoading = false;
          state.data = action.payload;
        }
      )
      .addCase(fetchProfileOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
  selectors: {
    selectProfileOrder: (sliceState) => sliceState.data,
    selectIsLoading: (sliceState) => sliceState.isLoading
  }
});

export const { selectProfileOrder, selectIsLoading } =
  profileOrderSlice.selectors;
export const { actions: profileOrderActions } = profileOrderSlice;
export const { reducer: profileOrderReducer } = profileOrderSlice;

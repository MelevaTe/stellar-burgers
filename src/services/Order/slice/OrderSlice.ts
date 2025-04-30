import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrderByNumberApi, orderBurgerApi } from '../../../utils/burger-api';
import { TOrder } from '@utils-types';

export interface orderSchema {
  order: TOrder | null;
  isLoading: boolean;
  error?: string;
}

const initialState: orderSchema = {
  order: null,
  isLoading: false,
  error: undefined
};

export const sendOrder = createAsyncThunk(
  'order/sendOrder',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);
    return response;
  }
);

export const getOrderByNumber = createAsyncThunk(
  'order/getOrderNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response;
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOrder.pending, (state) => {
        state.error = undefined;
        state.isLoading = true;
      })
      .addCase(sendOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = undefined;
        state.order = action.payload.order;
      })
      .addCase(sendOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      .addCase(getOrderByNumber.pending, (state) => {
        state.error = undefined;
        state.isLoading = true;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = undefined;
        state.order = action.payload.orders[0];
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
  selectors: {
    selectInfoOrder: (sliceState) => sliceState.order,
    selectIsLoading: (sliceState) => sliceState.isLoading
  }
});

export const { selectInfoOrder, selectIsLoading } = orderSlice.selectors;
export const { actions: orderActions } = orderSlice;
export const { reducer: orderReducer } = orderSlice;

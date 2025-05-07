import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrderByNumberApi, orderBurgerApi } from '../../../utils/burger-api';
import { TOrder } from '@utils-types';
import { burgerConstructorSlice } from '../../BurgerConstructor/slice/BurgerConstructorSlice';

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
  async (ingredients: string[], { dispatch }) => {
    const response = await orderBurgerApi(ingredients);
    dispatch(burgerConstructorSlice.actions.clearIngredietns());
    return response;
  }
);

export const getOrderByNumber = createAsyncThunk(
  'order/getOrderNumber',
  async (number: number, { dispatch }) => {
    const response = await getOrderByNumberApi(number);
    dispatch(orderSlice.actions.clearOrder());
    return response;
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.isLoading = false;
      state.error = undefined;
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

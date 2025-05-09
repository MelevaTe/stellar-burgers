import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../../utils/burger-api';
import { TIngredient } from '@utils-types';

export interface ingredientsSchema {
  data?: TIngredient[];
  isLoading: boolean;
  error?: string;
}

export const initialState: ingredientsSchema = {
  data: undefined,
  isLoading: false,
  error: undefined
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => {
    const ingredients = await getIngredientsApi();
    return ingredients;
  }
);

export const ingredienSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.error = undefined;
        state.isLoading = true;
      })
      .addCase(
        fetchIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.isLoading = false;
          state.data = action.payload;
        }
      )
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
  selectors: {
    selectIngredients: (sliceState) => sliceState.data,
    selectIsLoading: (sliceState) => sliceState.isLoading
  }
});

export const { selectIngredients, selectIsLoading } = ingredienSlice.selectors;
export const { actions: ingredienActions } = ingredienSlice;
export const { reducer: ingredienReducer } = ingredienSlice;

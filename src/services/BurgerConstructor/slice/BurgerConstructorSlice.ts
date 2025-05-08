import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';

export interface burgerConstructorSchema {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: burgerConstructorSchema = {
  bun: null,
  ingredients: []
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredients: (state, action: PayloadAction<TConstructorIngredient>) => {
      if (action.payload.type === 'bun') {
        state.bun = action.payload;
      } else {
        state.ingredients.push(action.payload);
      }
    },
    removeBurgerIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    clearIngredietns: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    moveIngredientUp: (state, action: PayloadAction<string>) => {
      const index = state.ingredients.findIndex(
        (item) => item.id === action.payload
      );
      if (index > 0) {
        const temp = state.ingredients[index - 1];
        state.ingredients[index - 1] = state.ingredients[index];
        state.ingredients[index] = temp;
      }
    },
    moveIngredientDown: (state, action: PayloadAction<string>) => {
      const index = state.ingredients.findIndex(
        (item) => item.id === action.payload
      );
      if (index < state.ingredients.length - 1) {
        const temp = state.ingredients[index + 1];
        state.ingredients[index + 1] = state.ingredients[index];
        state.ingredients[index] = temp;
      }
    }
  },
  selectors: {
    getBurgerAllSelector: (state) => ({
      bun: state.bun,
      ingredients: state.ingredients
    })
  }
});

export const { getBurgerAllSelector } = burgerConstructorSlice.selectors;
export const { actions: burgerConstructorActions } = burgerConstructorSlice;
export const { reducer: burgerConstructorReducer } = burgerConstructorSlice;

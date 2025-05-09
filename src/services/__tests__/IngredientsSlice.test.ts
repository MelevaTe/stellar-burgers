import { configureStore, Store } from '@reduxjs/toolkit';
import {
  initialState,
  ingredienReducer,
  fetchIngredients,
  selectIngredients,
  selectIsLoading
} from '../Ingredients/slice/IngredientsSlice';

describe('ingredienSlice - Ингредиенты', () => {
  let store: Store<{ ingredients: ReturnType<typeof ingredienReducer> }>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        ingredients: ingredienReducer
      }
    });
  });

  test('начальное состояние соответствует ожидаемому', () => {
    const state = store.getState().ingredients;
    expect(state).toEqual(initialState);
  });

  test('fetchIngredients.pending устанавливает isLoading в true', () => {
    store.dispatch(fetchIngredients.pending('requestId'));
    const state = store.getState().ingredients;
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeUndefined();
  });

  test('fetchIngredients.fulfilled обновляет данные', () => {
    const mockIngredients = [
      {
        _id: '1',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'image-url',
        image_large: 'large-image-url',
        image_mobile: 'mobile-image-url'
      },
      {
        _id: '2',
        name: 'Говяжий минифиле',
        type: 'main',
        proteins: 43,
        fat: 20,
        carbohydrates: 11,
        calories: 267,
        price: 850,
        image: 'image-url',
        image_large: 'large-image-url',
        image_mobile: 'mobile-image-url'
      }
    ];

    store.dispatch(fetchIngredients.fulfilled(mockIngredients, 'requestId'));
    const state = store.getState().ingredients;

    expect(state.isLoading).toBe(false);
    expect(state.data).toEqual(mockIngredients);
    expect(state.error).toBeUndefined();
  });

  test('fetchIngredients.rejected устанавливает сообщение об ошибке', () => {
    const errorMessage = 'Сетевая ошибка';
    store.dispatch(
      fetchIngredients.rejected(new Error(errorMessage), 'requestId')
    );
    const state = store.getState().ingredients;

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  test('selectIngredients возвращает список ингредиентов', () => {
    const mockIngredients = [
      {
        _id: '1',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'image-url',
        image_large: 'large-image-url',
        image_mobile: 'mobile-image-url'
      }
    ];

    store.dispatch(fetchIngredients.fulfilled(mockIngredients, 'requestId'));
    const result = selectIngredients(store.getState());

    expect(result).toEqual(mockIngredients);
  });

  test('selectIsLoading возвращает флаг загрузки', () => {
    store.dispatch(fetchIngredients.pending('requestId'));
    expect(selectIsLoading(store.getState())).toBe(true);

    store.dispatch(fetchIngredients.fulfilled([], 'requestId'));
    expect(selectIsLoading(store.getState())).toBe(false);
  });
});

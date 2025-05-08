import { configureStore, Store } from '@reduxjs/toolkit';
import {
  profileOrderReducer,
  fetchProfileOrder,
  selectProfileOrder,
  selectIsLoading
} from '../ProfileOrder/slice/ProfileOrder';

describe('profileOrderSlice - Заказы пользователя', () => {
  let store: Store<{ profileOrder: ReturnType<typeof profileOrderReducer> }>;

  const mockOrders = [
    {
      _id: '681cea65c2f30c001cb22737',
      status: 'done',
      name: 'Краторный бургер',
      createdAt: '2025-05-08T17:31:17.908Z',
      updatedAt: '2025-05-08T17:31:18.665Z',
      number: 76613,
      ingredients: [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa093e',
        '643d69a5c3f7b9001cfa093d'
      ]
    },
    {
      _id: '681cea84c2f30c001cb22738',
      status: 'pending',
      name: 'Флюоресцентный астероидный фалленианский минеральный',
      createdAt: '2025-05-08T17:31:48.676Z',
      updatedAt: '2025-05-08T17:31:49.366Z',
      number: 76614,
      ingredients: [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa0947',
        '643d69a5c3f7b9001cfa0946',
        '643d69a5c3f7b9001cfa0942',
        '643d69a5c3f7b9001cfa094a',
        '643d69a5c3f7b9001cfa093d'
      ]
    }
  ];

  beforeEach(() => {
    store = configureStore({
      reducer: {
        profileOrder: profileOrderReducer
      }
    });
  });

  test('начальное состояние соответствует ожидаемому', () => {
    const state = store.getState().profileOrder;
    expect(state).toEqual({
      data: [],
      isLoading: false,
      error: undefined
    });
  });

  test('fetchProfileOrder.pending устанавливает isLoading в true', () => {
    store.dispatch(fetchProfileOrder.pending('requestId'));
    const state = store.getState().profileOrder;

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeUndefined();
  });

  test('fetchProfileOrder.fulfilled обновляет список заказов', () => {
    const response = {
      success: true,
      orders: mockOrders,
      total: 76240,
      totalToday: 86
    };

    store.dispatch(fetchProfileOrder.fulfilled(response.orders, 'requestId'));
    const state = store.getState().profileOrder;

    expect(state.isLoading).toBe(false);
    expect(state.data).toEqual(mockOrders);
    expect(state.error).toBeUndefined();
  });

  test('fetchProfileOrder.rejected устанавливает сообщение об ошибке', () => {
    const errorMessage = 'Ошибка при получении списка заказов';

    store.dispatch(
      fetchProfileOrder.rejected(new Error(errorMessage), 'requestId')
    );
    const state = store.getState().profileOrder;

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  test('selectProfileOrder возвращает список заказов', () => {
    store.dispatch(fetchProfileOrder.fulfilled(mockOrders, 'requestId'));

    const result = selectProfileOrder(store.getState());
    expect(result).toEqual(mockOrders);
  });

  test('selectIsLoading возвращает флаг загрузки', () => {
    store.dispatch(fetchProfileOrder.pending('requestId'));
    expect(selectIsLoading(store.getState())).toBe(true);

    store.dispatch(fetchProfileOrder.fulfilled(mockOrders, 'requestId'));
    expect(selectIsLoading(store.getState())).toBe(false);
  });
});

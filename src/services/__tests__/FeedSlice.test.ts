import { configureStore, Store } from '@reduxjs/toolkit';
import {
  initialState,
  feedReducer,
  fetchFeeds,
  selectFeeds,
  selectOrders,
  selectTotals,
  selectIsLoading
} from '../Feed/slice/FeedSlice';

describe('feedSlice - Лента заказов', () => {
  let store: Store<{ feeds: ReturnType<typeof feedReducer> }>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        feeds: feedReducer
      }
    });
  });

  test('начальное состояние соответствует ожидаемому', () => {
    const state = store.getState().feeds;
    expect(state).toEqual(initialState);
  });

  test('fetchFeeds.pending устанавливает isLoading в true', () => {
    store.dispatch(fetchFeeds.pending('requestId'));
    const state = store.getState().feeds;
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeUndefined();
  });

  test('fetchFeeds.fulfilled обновляет данные', () => {
    const mockData = {
      orders: [
        {
          _id: '1',
          status: 'done',
          name: 'Order 1',
          createdAt: '2025-05-01',
          updatedAt: '2025-05-01',
          number: 1,
          ingredients: ['ingredient1', 'ingredient2']
        }
      ],
      total: 1000,
      totalToday: 100
    };

    store.dispatch(fetchFeeds.fulfilled(mockData, 'requestId'));
    const state = store.getState().feeds;
    expect(state.isLoading).toBe(false);
    expect(state.data).toEqual(mockData);
    expect(state.error).toBeUndefined();
  });

  test('fetchFeeds.rejected устанавливает сообщение об ошибке', () => {
    const errorMessage = 'Сетевая ошибка';
    store.dispatch(fetchFeeds.rejected(new Error(errorMessage), 'requestId'));
    const state = store.getState().feeds;
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  test('selectFeeds возвращает данные о ленте', () => {
    const mockData = {
      orders: [],
      total: 100,
      totalToday: 10
    };
    store.dispatch(fetchFeeds.fulfilled(mockData, 'requestId'));
    const result = selectFeeds(store.getState());
    expect(result).toEqual(mockData);
  });

  test('selectOrders возвращает список заказов', () => {
    const mockData = {
      orders: [
        {
          _id: '1',
          status: 'done',
          name: 'Order 1',
          createdAt: '2025-05-01',
          updatedAt: '2025-05-01',
          number: 1,
          ingredients: ['ingredient1', 'ingredient2']
        }
      ],
      total: 1000,
      totalToday: 100
    };
    store.dispatch(fetchFeeds.fulfilled(mockData, 'requestId'));
    const result = selectOrders(store.getState());
    expect(result).toEqual(mockData.orders);
  });

  test('selectTotals возвращает общее количество заказов', () => {
    const mockData = {
      orders: [],
      total: 1000,
      totalToday: 100
    };
    store.dispatch(fetchFeeds.fulfilled(mockData, 'requestId'));
    const result = selectTotals(store.getState());
    expect(result).toEqual({
      total: mockData.total,
      totalToday: mockData.totalToday
    });
  });

  test('selectIsLoading возвращает флаг загрузки', () => {
    store.dispatch(fetchFeeds.pending('requestId'));
    expect(selectIsLoading(store.getState())).toBe(true);

    store.dispatch(
      fetchFeeds.fulfilled({ orders: [], total: 0, totalToday: 0 }, 'requestId')
    );
    expect(selectIsLoading(store.getState())).toBe(false);
  });
});

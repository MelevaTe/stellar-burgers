import { configureStore, Store } from '@reduxjs/toolkit';
import {
  orderReducer,
  sendOrder,
  getOrderByNumber,
  selectInfoOrder,
  selectIsLoading,
  orderActions
} from '../Order/slice/OrderSlice';

describe('orderSlice - Заказ', () => {
  let store: Store<{ order: ReturnType<typeof orderReducer> }>;

  const mockIngredients = [
    '643d69a5c3f7b9001cfa093d',
    '643d69a5c3f7b9001cfa093e',
    '643d69a5c3f7b9001cfa093d'
  ];

  const mockOrder = {
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
  };

  beforeEach(() => {
    store = configureStore({
      reducer: {
        order: orderReducer
      }
    });
  });

  test('начальное состояние соответствует ожидаемому', () => {
    const state = store.getState().order;
    expect(state).toEqual({
      order: null,
      isLoading: false,
      error: undefined
    });
  });

  test('sendOrder.pending устанавливает isLoading в true', () => {
    store.dispatch(sendOrder.pending('requestId', mockIngredients));
    const state = store.getState().order;

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeUndefined();
  });

  test('sendOrder.fulfilled сохраняет заказ в состоянии', () => {
    const response = {
      success: true,
      order: mockOrder,
      name: 'Краторный бургер'
    };

    store.dispatch(sendOrder.fulfilled(response, 'requestId', mockIngredients));
    const state = store.getState().order;

    expect(state.isLoading).toBe(false);
    expect(state.order).toEqual(mockOrder);
    expect(state.error).toBeUndefined();
  });

  test('sendOrder.rejected устанавливает сообщение об ошибке', () => {
    const errorMessage = 'Ошибка при отправке заказа';

    store.dispatch(
      sendOrder.rejected(new Error(errorMessage), 'requestId', mockIngredients)
    );
    const state = store.getState().order;

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  test('getOrderByNumber.pending устанавливает isLoading в true', () => {
    store.dispatch(getOrderByNumber.pending('requestId', 12345));
    const state = store.getState().order;

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeUndefined();
  });

  test('getOrderByNumber.fulfilled сохраняет заказ в состоянии', () => {
    const response = {
      success: true,
      orders: [mockOrder]
    };

    store.dispatch(getOrderByNumber.fulfilled(response, 'requestId', 12345));
    const state = store.getState().order;

    expect(state.isLoading).toBe(false);
    expect(state.order).toEqual(mockOrder);
    expect(state.error).toBeUndefined();
  });

  test('getOrderByNumber.rejected устанавливает сообщение об ошибке', () => {
    const errorMessage = 'Ошибка при получении заказа';

    store.dispatch(
      getOrderByNumber.rejected(new Error(errorMessage), 'requestId', 12345)
    );
    const state = store.getState().order;

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  test('selectInfoOrder возвращает текущий заказ', () => {
    store.dispatch(
      sendOrder.fulfilled(
        { success: true, order: mockOrder, name: 'Краторный бургер' },
        'requestId',
        mockIngredients
      )
    );

    const result = selectInfoOrder(store.getState());
    expect(result).toEqual(mockOrder);
  });

  test('selectIsLoading возвращает флаг загрузки', () => {
    store.dispatch(sendOrder.pending('requestId', mockIngredients));
    expect(selectIsLoading(store.getState())).toBe(true);

    store.dispatch(
      sendOrder.fulfilled(
        { success: true, order: mockOrder, name: 'Краторный бургер' },
        'requestId',
        mockIngredients
      )
    );
    expect(selectIsLoading(store.getState())).toBe(false);
  });

  test('clearOrder очищает заказ и сбрасывает состояние', () => {
    store.dispatch(
      sendOrder.fulfilled(
        { success: true, order: mockOrder, name: 'Краторный бургер' },
        'requestId',
        mockIngredients
      )
    );

    store.dispatch(orderActions.clearOrder());

    const state = store.getState().order;

    expect(state.order).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeUndefined();
  });
});
